
    // Javascript program to find strongly connected
    // components in a given directed graph
    // using Tarjan's algorithm (single DFS)

    // This class represents a directed graph
    // using adjacency list representation
export default class Graph{

    adj;
    V;
    Time;

// Constructor
    constructor(v) {
        this.V = v;
        this.adj = new Array(v);

        for(let i = 0; i < v; ++i) {
            this.adj[i] = [];
        }

        this.Time = 0;
    }

// Function to add an edge into the graph
    addEdge(v, w) {
        this.adj[v].push(w);
    }

// A recursive function that finds and prints strongly
// connected components using DFS traversal
// u --> The vertex to be visited next
// disc[] --> Stores discovery times of visited vertices
// low[] -- >> earliest visited vertex (the vertex with
//			 minimum discovery time) that can be reached
//			 from subtree rooted with current vertex
// st -- >> To store all the connected ancestors (could be
//		 part of SCC)
// stackMember[] --> bit/index array for faster check
//				 whether a node is in stack
    SCCUtil(u, low, disc, stackMember, st, y) {

        // Initialize discovery time and low value
        disc[u] = this.Time;
        low[u] = this.Time;
        this.Time += 1;
        stackMember[u] = true;
        st.push(u);

        let n;

        // Go through all vertices adjacent to this
        for(let i of this.adj[u]) {
            n = i;

            if (disc[n] === -1) {
                this.SCCUtil(n, low, disc, stackMember, st, y);

                // Check if the subtree rooted with v
                // has a connection to one of the
                // ancestors of u
                // Case 1 (per above discussion on
                // Disc and Low value)
                low[u] = Math.min(low[u], low[n]);
            }
            else if (stackMember[n] === true) {

                // Update low value of 'u' only if 'v' is
                // still in stack (i.e. it's a back edge,
                // not cross edge).
                // Case 2 (per above discussion on Disc
                // and Low value)
                low[u] = Math.min(low[u], disc[n]);
            }
        }

        // Head node found, pop the stack and print an SCC
        // To store stack extracted vertices
        console.log('set initial values')
        let w = -1;
        if (low[u] === disc[u]) {
            let x = []
            while (w !== u) {
                w = st.pop();
                x.push(w);
                stackMember[w] = false;
            }
            if (x.length > 1) {
                y.push(x)
            }
        }
    }

// The function to do DFS traversal.
// It uses SCCUtil()
    SCC() {

        // Mark all the vertices as not visited
        // and Initialize parent and visited,
        // and ap(articulation point) arrays
        let disc = new Array(this.V);
        let low = new Array(this.V);
        for(let i = 0;i < this.V; i++) {
            disc[i] = -1;
            low[i] = -1;
        }

        let stackMember = new Array(this.V);
        let st = [];

        // Call the recursive helper function
        // to find articulation points
        // in DFS tree rooted with vertex 'i'
        let y = [];
        for(let i = 0; i < this.V; i++) {
            console.log('forLoop')
            if (disc[i] === -1) {
                this.SCCUtil(i, low, disc, stackMember, st, y)
            }
        }
        return y
    }
}