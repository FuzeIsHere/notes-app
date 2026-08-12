
note = {
    ownerId: "...",
    collaborators: [],
    title: "Shopping",
    content: { /*...TipTap JSON...*/ },
    preview: '',
    categoryName: "General",
    categoryId: "x",
    pinned: false,
    archived: false,
    deleted: false,
    created: serverTimestamp(),
    updated: serverTimestamp(),
    textLastUpdated: serverTimestamp(),
}

noteEmbedding = {
    ownerId: "...",
    noteId: "...",
    category: '',
    embedding: Vector(vector_array), //384 dim
    textLastUpdated: note_data.get("textLastUpdated", 0),
    archived: false,
    deleted: false
}

user = {
    email: email,
    displayName: '...',
    categories: [
        {
            name: "General",
            id: "x",
            created: Timestamp.now()
        },
    ]
}