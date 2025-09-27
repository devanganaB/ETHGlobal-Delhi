from hyperon import MeTTa, E, S, ValueAtom

def initialize_knowledge_graph(metta: MeTTa):
    """Initialize MeTTa knowledge graph with coding topics and requirements."""

    # Topics
    metta.space().add_atom(E(S("topic"), S("array")))
    metta.space().add_atom(E(S("topic"), S("string")))
    metta.space().add_atom(E(S("topic"), S("hashmap")))
    metta.space().add_atom(E(S("topic"), S("hashset")))
    metta.space().add_atom(E(S("topic"), S("linkedlist")))
    metta.space().add_atom(E(S("topic"), S("tree")))

    # Requirements
    metta.space().add_atom(E(S("requirement"), S("public_test_cases"), ValueAtom(">=2")))
    metta.space().add_atom(E(S("requirement"), S("hidden_test_cases"), ValueAtom("=2")))
    # metta.space().add_atom(E(S("requirement"), S("output_format"), ValueAtom("json")))
    # metta.space().add_atom(E(S("requirement"), S("description"), ValueAtom("well-defined problem statement")))
