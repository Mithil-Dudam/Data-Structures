class Graph:
    def __init__(self):
        self.adj_list = dict()

    def add_node(self, node):
        if node not in self.adj_list:
            self.adj_list[node] = set()
            return
        return "Node already present"

    def remove_node(self, node):
        if node not in self.adj_list:
            return "Node not found"
        del self.adj_list[node]
        for key in self.adj_list.keys():
            if node in self.adj_list[key]:
                self.adj_list[key].remove(node)

    def add_edge(self, from_node, to_node):
        if from_node in self.adj_list:
            if to_node in self.adj_list:
                self.adj_list[from_node].add(to_node)
                self.adj_list[to_node].add(from_node)
                return 
            return f"{to_node} is not a node"
        return f"{from_node} is not a node"

    def remove_edge(self, from_node, to_node):
        if from_node in self.adj_list:
            if to_node in self.adj_list:
                if to_node in self.adj_list[from_node]:
                    self.adj_list[from_node].remove(to_node)
                    self.adj_list[to_node].remove(from_node)
                    return 
                return "Edge doesnt exist"
            return f"{to_node} is not a node"
        return f"{from_node} is not a node"

    def get_neighbours(self, node):
        if node in self.adj_list:
            return self.adj_list[node]
        return f"{node} not found"

    def has_node(self, node):
        return node in self.adj_list

    def has_edge(self, from_node, to_node):
        if from_node in self.adj_list:
            if to_node in self.adj_list:
                if to_node in self.adj_list[from_node]:
                    return True 
                return False 
            return False 
        return False 
                

    def get_nodes(self):
        return list(self.adj_list.keys())

    def get_edges(self):
        edges = set()
        for node, neighbours in self.adj_list.items():
            for neighbour in neighbours:
                edge = tuple(sorted((node, neighbour)))
                edges.add(edge)
        return list(edges)
    
    def bfs(self, start):
        visited = set()
        queue = [start]
        order = []
        visited.add(start)
        while queue:
            node = queue.pop(0)
            order.append(node)
            neighbours = list(self.adj_list[node])
            for neighbour in neighbours:
                if neighbour not in visited:
                    visited.add(neighbour)
                    queue.append(neighbour)
        return order


    def dfs(self, start):
        visited = set()
        stack = [start]
        order = []
        visited.add(start)
        while stack:
            node = stack.pop()
            order.append(node)
            neighbours = list(self.adj_list[node])
            for neighbour in sorted(neighbours, reverse=True):
                if neighbour not in visited:
                    visited.add(neighbour)
                    stack.append(neighbour)
        return order

g = Graph()

# Add nodes
g.add_node("A")
g.add_node("B")
g.add_node("C")
g.add_node("D")

# Add edges
g.add_edge("A", "B")
g.add_edge("A", "C")
g.add_edge("B", "D")
g.add_edge("C", "D")

# Print nodes and edges
print("Nodes:", g.get_nodes())  # ['A', 'B', 'C', 'D']
print("Edges:", g.get_edges())  # [('A', 'B'), ('A', 'C'), ('B', 'D'), ('C', 'D')]

# Get neighbours
print("Neighbours of A:", g.get_neighbours("A"))  # {'B', 'C'}
print("Neighbours of D:", g.get_neighbours("D"))  # {'B', 'C'}

# Check node and edge existence
print("Has node 'A':", g.has_node("A"))  # True
print("Has node 'E':", g.has_node("E"))  # False
print("Has edge A-B:", g.has_edge("A", "B"))  # True
print("Has edge B-C:", g.has_edge("B", "C"))  # False

# Remove edge and node
g.remove_edge("A", "B")
print("Edges after removing A-B:", g.get_edges())  # [('A', 'C'), ('B', 'D'), ('C', 'D')]
g.remove_node("D")
print("Nodes after removing D:", g.get_nodes())  # ['A', 'B', 'C']
print("Edges after removing D:", g.get_edges())  # [('A', 'C')]

# BFS and DFS
g.add_edge("B", "C")
print("BFS from A:", g.bfs("A"))  # ['A', 'C', 'B']
print("DFS from A:", g.dfs("A"))  # ['A', 'C', 'B'] or similar order depending on neighbors

# Try invalid operations
print(g.add_edge("A", "E"))  # 'E is not a node'
print(g.remove_edge("A", "E"))  # 'E is not a node'
print(g.get_neighbours("E"))  # 'E not found'