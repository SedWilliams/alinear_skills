#!/usr/bin/env python3
"""Structure checks for a mind map or concept map, so branches and links are counted, not eyeballed.

Usage: python3 map_checks.py <map.json>

Checks, in the order a learner would fix them:
  backbone      how many big ideas there are (3 to 7 is typical) and whether they link to each other
  connected     nodes that sit apart from the main map
  branching     nodes with more than 4 branches, and nodes that branch into only one
  pass-through  nodes with one link in and one link out, the links of a chain
  cross-links   whether the branches off the center link to each other or only through it (a spoke shape)
  tangle        three or more detail-to-detail links between different branches
  directional   links drawn as plain lines with no arrowhead
  unlabeled     links with no words on them, listed as candidate questions

Accepts two shapes of JSON:

1. The transcription format from SKILL.md:
   {"title": "...", "center": "id",
    "nodes": [{"id": "a", "label": "...", "layer": "logic|concept|detail|arbitrary"}],
    "edges": [{"from": "a", "to": "b", "label": "", "arrow": true}]}
   `center`, `layer`, `label`, and `arrow` are optional. An edge points the way its
   arrowhead does; a plain line is written center-outward with "arrow": false.

2. An ALinear workspace export (nodes[].data.kind/title/layer, edges[].source/target).
   Only concept, question, and misconception nodes count, as in ALinear's own checks.

Every line starts with FLAG, ok, or --. These are structural facts, not verdicts:
the reviewer decides what they mean for this map. Standard library only.
"""
import json
import sys
from collections import defaultdict, deque

ALINEAR_MAP_KINDS = {"concept", "question", "misconception"}
MIN_CHUNKS, MAX_CHUNKS = 3, 7  # most topics have about 3 to 7 big ideas
MAX_BRANCHES = 4  # working memory holds about four chunks (Cowan, 2001)
TANGLE_LINKS = 3  # point-to-point links across branches before it reads as a tangle


def load(path):
    with open(path, encoding="utf-8") as f:
        raw = json.load(f)
    edges_in = raw.get("edges", [])
    if any("source" in e for e in edges_in):
        # ALinear export: directed edges, no center, layers on node data.
        nodes = {}
        for n in raw.get("nodes", []):
            data = n.get("data", {})
            if data.get("kind") in ALINEAR_MAP_KINDS:
                nodes[n["id"]] = {"label": (data.get("title") or "").strip() or "(untitled)", "layer": data.get("layer")}
        edges = []
        for e in edges_in:
            if e["source"] in nodes and e["target"] in nodes and e["source"] != e["target"]:
                label = e.get("label") if isinstance(e.get("label"), str) else ""
                rationale = (e.get("data") or {}).get("rationale", "")
                edges.append({"from": e["source"], "to": e["target"], "label": (label or rationale).strip(), "arrow": True})
        return raw.get("title", ""), None, nodes, edges

    nodes = {n["id"]: {"label": n.get("label", n["id"]), "layer": n.get("layer")} for n in raw.get("nodes", [])}
    edges = []
    for e in edges_in:
        for end in (e["from"], e["to"]):
            if end not in nodes:
                sys.exit(f"Edge {e['from']} -> {e['to']} names unknown node '{end}'. Add it to nodes.")
        if e["from"] != e["to"]:
            edges.append({"from": e["from"], "to": e["to"], "label": (e.get("label") or "").strip(), "arrow": e.get("arrow", True)})
    center = raw.get("center")
    if center is not None and center not in nodes:
        sys.exit(f"center '{center}' is not a node id.")
    return raw.get("title", ""), center, nodes, edges


def quoted(label):
    """Wrap a label in double quotes unless the learner already quoted it."""
    return label if len(label) > 1 and label[0] in "\"'" and label[-1] == label[0] else f'"{label}"'


def names(ids, nodes, limit=6):
    shown = ", ".join(quoted(nodes[i]["label"]) for i in ids[:limit])
    return shown + (f" and {len(ids) - limit} more" if len(ids) > limit else "")


def components(ids, neighbors):
    """Connected groups among `ids`, ignoring direction. Neighbors outside `ids` are skipped."""
    ids_set, seen, groups = set(ids), set(), []
    for start in ids:
        if start in seen:
            continue
        group, stack = [], [start]
        seen.add(start)
        while stack:
            cur = stack.pop()
            group.append(cur)
            for nxt in neighbors[cur]:
                if nxt in ids_set and nxt not in seen:
                    seen.add(nxt)
                    stack.append(nxt)
        groups.append(group)
    return sorted(groups, key=len, reverse=True)


def check(title, center, nodes, edges):
    out_deg, in_deg = defaultdict(int), defaultdict(int)
    neighbors = defaultdict(set)
    for e in edges:
        out_deg[e["from"]] += 1
        in_deg[e["to"]] += 1
        neighbors[e["from"]].add(e["to"])
        neighbors[e["to"]].add(e["from"])
    ids = list(nodes)
    lines = [f"Map: {title or '(untitled)'}. {len(nodes)} nodes, {len(edges)} links."
             + (f' Center: {quoted(nodes[center]["label"])}.' if center else " No center given.")]
    if len(nodes) < 3:
        return lines + ["Too few nodes to judge structure."]

    # Backbone: logic-layer nodes if tagged, else the branches straight off the center.
    layered = any(n["layer"] for n in nodes.values())
    if layered:
        chunks = [i for i in ids if nodes[i]["layer"] == "logic"]
        source = "logic-layer nodes"
    elif center:
        chunks = sorted(neighbors[center])
        source = "branches off the center"
    else:
        chunks = []
        source = None
    if source:
        n = len(chunks)
        size = "ok" if MIN_CHUNKS <= n <= MAX_CHUNKS else "FLAG"
        lines.append(f"{size} backbone: {n} {source} (usually {MIN_CHUNKS} to {MAX_CHUNKS}): {names(chunks, nodes)}.")
        chunk_set = set(chunks)
        linked = {i for i in chunks if neighbors[i] & chunk_set}
        unlinked = [i for i in chunks if i not in linked]
        if n >= 2:
            if unlinked:
                lines.append(f"FLAG backbone links: {names(unlinked, nodes)} not linked directly to another backbone idea.")
            else:
                lines.append("ok backbone links: every backbone idea links directly to another.")
    else:
        lines.append("-- backbone: no center and no layers, so the biggest ideas are unknown. Judge by eye.")

    groups = components(ids, neighbors)
    stray = [i for g in groups[1:] for i in g]
    lines.append(f"FLAG connected: {names(stray, nodes)} {'sits' if len(stray) == 1 else 'sit'} apart from the main map." if stray
                 else "ok connected: one connected map.")

    # With a center, a node's branches are its neighbors one step farther out, whichever way the
    # arrows point (causes often point inward). Without one, fall back to arrow direction, as ALinear does.
    depth = {}
    if center:
        depth = {center: 0}
        queue = deque([center])
        while queue:
            cur = queue.popleft()
            for nxt in neighbors[cur]:
                if nxt not in depth:
                    depth[nxt] = depth[cur] + 1
                    queue.append(nxt)
        branches = {i: [n for n in neighbors[i] if depth.get(n) == depth[i] + 1] for i in depth}
        chains = [i for i in depth if i != center and len(neighbors[i]) == 2 and len(branches[i]) == 1
                  and any(depth.get(n) == depth[i] - 1 for n in neighbors[i])]
        lone = [i for i in depth if len(branches[i]) == 1 and i not in chains]
    else:
        lines.append("-- no center, so branches are counted by arrow direction.")
        branches = {i: [e["to"] for e in edges if e["from"] == i] for i in ids}
        chains = [i for i in ids if in_deg[i] == 1 and out_deg[i] == 1]
        lone = []

    bushy = [i for i in branches if len(branches[i]) > MAX_BRANCHES]
    lines.append("FLAG branching, too many: " + "; ".join(f'{quoted(nodes[i]["label"])} has {len(branches[i])} branches' for i in bushy) + "."
                 if bushy else f"ok branching, too many: no node has more than {MAX_BRANCHES} branches.")

    if chains:
        parts = []
        for i in chains:
            nxt = branches[i][0]
            terminal = len(neighbors[nxt]) == 1
            parts.append(quoted(nodes[i]["label"]) + (f' (leads only to end node {quoted(nodes[nxt]["label"])})' if terminal else ""))
        lines.append("FLAG pass-through nodes (one link in, one out): " + ", ".join(parts) + ".")
    else:
        lines.append("ok pass-through nodes: none.")
    if lone:
        lines.append(f"FLAG branching, too few: {names(lone, nodes)} {'branches' if len(lone) == 1 else 'branch'} into only one node.")

    # Cross-links and tangles need to know which first-level branch each node hangs off.
    if center and len(neighbors[center]) >= 2:
        first = sorted(neighbors[center])
        branch = {c: c for c in first}
        queue = deque(first)
        while queue:
            cur = queue.popleft()
            for nxt in neighbors[cur]:
                if nxt != center and nxt not in branch:
                    branch[nxt] = branch[cur]
                    queue.append(nxt)
        # With the center removed, a branch whose group holds no other branch links to the rest only through the center.
        rest = [i for i in ids if i != center]
        group_of = {i: g for g, members in enumerate(components(rest, neighbors)) for i in members}
        isolated = [c for c in first if not any(group_of[o] == group_of[c] for o in first if o != c)]
        joined = len(first) - len(isolated)
        if joined == 0 and len(first) >= 3:
            lines.append(f"FLAG spoke shape: none of the {len(first)} branches off the center link to each other except through the center.")
        elif isolated:
            lines.append(f"FLAG linked only through the center: {names(isolated, nodes)}.")
        else:
            lines.append("ok cross-links: every branch off the center links to another branch.")
        cross = [e for e in edges
                 if e["from"] in branch and e["to"] in branch and branch[e["from"]] != branch[e["to"]]
                 and e["from"] not in first and e["to"] not in first]
        if len(cross) >= TANGLE_LINKS:
            pairs = "; ".join(f'{quoted(nodes[e["from"]]["label"])} -> {quoted(nodes[e["to"]]["label"])}' for e in cross[:5])
            lines.append(f"FLAG tangle: {len(cross)} point-to-point links cross between branches ({pairs}).")
        hist = defaultdict(int)
        for d in depth.values():
            hist[d] += 1
        lines.append("-- depth from center: " + ", ".join(f"{hist[d]} at {d}" for d in sorted(hist))
                     + ". A map that stops at depth 2 may be missing detail; judge against the map's stage.")

    if layered:
        counts = defaultdict(int)
        for n in nodes.values():
            counts[n["layer"] or "untagged"] += 1
        lines.append("-- layers: " + ", ".join(f"{counts[k]} {k}" for k in ("logic", "concept", "detail", "arbitrary", "untagged") if counts[k]) + ".")

    plain = [e for e in edges if not e["arrow"]]
    if plain:
        lines.append(f"FLAG directional: {len(plain)} of {len(edges)} links are plain lines with no arrowhead.")
    else:
        lines.append("ok directional: every link has a direction.")

    bare = [e for e in edges if not e["label"]]
    if bare:
        listed = "; ".join(f'{quoted(nodes[e["from"]]["label"])} -> {quoted(nodes[e["to"]]["label"])}' for e in bare[:8])
        more = f" and {len(bare) - 8} more" if len(bare) > 8 else ""
        lines.append(f"-- unlabeled links ({len(bare)}), candidates for \"what does this arrow mean?\": {listed}{more}.")
    return lines


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    print("\n".join(check(*load(sys.argv[1]))))
