class Graph:
    def __init__(self):
        self.adj = dict()

    def add_node(self, node):
        if self.has_node(node):
            return f"{node} is already in the graph"
        self.adj[node] = set()
        return f"{node} added to graph"

    def remove_node(self, node):
        if not self.has_node(node):
            return f"{node} not found in graph"
        for n in self.adj:
            if n == node:
                continue
            if node in self.adj[n]:
                self.adj[n].remove(node)
        del self.adj[node]
        return f"{node} removed from graph"

    def add_edge(self, node1, node2):
        if not self.has_node(node1):
            return f"{node1} not found in graph"
        if not self.has_node(node2):
            return f"{node2} not found in graph"
        if node2 in self.adj[node1]:
            return "Edge already present"
        self.adj[node1].add(node2)
        self.adj[node2].add(node1)
        return f"Added edge between {node1} and {node2}"

    def remove_edge(self, node1, node2):
        if not self.has_node(node1):
            return f"{node1} not found in graph"
        if not self.has_node(node2):
            return f"{node2} not found in graph"
        if node2 not in self.adj[node1]:
            return "No edge exists"
        self.adj[node1].remove(node2)
        self.adj[node2].remove(node1)
        return f"Removed edge between {node1} and {node2}"

    def get_neighbours(self, node):
        if not self.has_node(node):
            return f"{node} not found in graph"
        return list(self.adj[node])

    def has_node(self, node):
        return node in self.adj

    def has_edge(self, node1, node2):
        if self.has_node(node1) and self.has_node(node2):
            if node2 in self.adj[node1]:
                return True
            return False
        return False

    def get_nodes(self):
        return list(self.adj.keys())

    def get_edges(self):
        edges = []
        seen = set()
        for node in self.adj:
            seen.add(node)
            for n in self.adj[node]:
                if n not in seen:
                    edges.append((node, n))
        return edges

    def bfs(self, node):
        if not self.has_node(node):
            return f"{node} not found in graph"
        queue = [node]
        seen = {node}
        path = []
        while queue:
            popped_node = queue.pop(0)
            path.append(popped_node)
            for n in self.adj[popped_node]:
                if n not in seen:
                    queue.append(n)
                    seen.add(n)
        return path

    def dfs(self, node):
        if not self.has_node(node):
            return f"{node} not found in graph"
        stack = [node]
        seen = {node}
        path = []
        while stack:
            popped_node = stack.pop()
            path.append(popped_node)
            for n in self.adj[popped_node]:
                if n not in seen:
                    stack.append(n)
                    seen.add(n)
        return path
    
    def graph_to_dict(self):
        return {
            "nodes": self.get_nodes(),
            "edges": self.get_edges()
        }