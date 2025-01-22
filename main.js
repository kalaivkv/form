let posts = [];
const postsPerPage = 5;
let currentPage = 1;

document.getElementById('newPostBtn').addEventListener('click', function () {
    start();
    document.getElementById('formTitle').innerText = 'Create New Post';
    document.getElementById('form').style.display = 'block';
    document.getElementById('savePostBtn').onclick = saveNewPost;
});

document.getElementById('cancelPostBtn').addEventListener('click', function () {
    start();
    document.getElementById('form').style.display = 'none';
});

function start() {
    document.getElementById('id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
}

function saveNewPost() {
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    if (id && name && phone) {
        const newPost = { id, name, phone, enabled: true };
        posts.push(newPost);
        displayPost();
        start();
        document.getElementById('form').style.display = 'none';
    }
    else {
        alert("Please fill all details.");
    }
}

function displayPost() {
    const entries = document.getElementById('entries');
    entries.innerHTML = '';
    const titleRow = document.createElement('div');
    titleRow.className = 'titles post';
    titleRow.innerHTML =
        "<div>ID</div>" +
        "<div>Name</div>" +
        "<div>Phone No</div>" +
        "<div>Enabled</div>" +
        "<div>Actions</div>";
    entries.appendChild(titleRow);
    const filteredPost = filterPostBySearch(posts);
    const paginatedPost = paginate(filteredPost);
    const postElements = paginatedPost.map(post => {
        return (
            "<div class='post'>" +
            "<div>" + post.id + "</div>" +
            "<div>" + post.name + "</div>" +
            "<div>" + post.phone + "</div>" +
            "<div>" +
            "<span onclick='toggleEnabled(\"" + post.id + "\")'>" +
            (post.enabled ? '<i class=\"bi bi-toggle-on\"></i>' : '<i class=\"bi bi-toggle2-off\"></i>') +
            "</span>" +
            "</div>" +
            "<div>" +
            "<span class='edit' onclick='editPost(\"" + post.id + "\")'><i class='bi bi-pencil'></i></span>" +
            "<span class='delete' onclick='deletePost(\"" + post.id + "\")'><i class='bi bi-trash'></i></span>" +
            "</div>" +
            "</div>");
    }).join("");
    entries.innerHTML += postElements;
    updatePagination(filteredPost.length);
}

function toggleEnabled(id) {
    const post = posts.find(p => p.id === id);
    if (post) {
        post.enabled = !post.enabled;
        displayPost();
    }
}

function filter() {
    currentPage = 1;
    displayPost();
}

function filterPostBySearch(posts) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    return posts.filter(post =>
        post.name.toLowerCase().includes(searchTerm) ||
        post.id.toLowerCase().includes(searchTerm) ||
        post.phone.toLowerCase().includes(searchTerm)
    );
}

function paginate(filteredPost) {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPost.slice(startIndex, startIndex + postsPerPage);
}

function updatePagination(totalFiltered) {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(totalFiltered / postsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${currentPage === i ? 'active' : ''}`;
        pageItem.innerHTML = `<a class='page-link' href='#' onclick='changePage(${i})'>${i}</a>`;
        paginationControls.appendChild(pageItem);
    }
}

function changePage(page) {
    currentPage = page;
    displayPost();
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (post) {
        document.getElementById('form').style.display = 'block';
        document.getElementById('formTitle').innerText = 'Edit Post';
        document.getElementById('id').value = post.id;
        document.getElementById('name').value = post.name;
        document.getElementById('phone').value = post.phone;
        document.getElementById('savePostBtn').onclick = function () {
            updatePost(post);
        };
        document.getElementById('savePostBtn').innerText = "Save Post";
    }
}

function deletePost(id) {
    posts = posts.filter(post => post.id !== id);
    displayPost();
}

function updatePost(postToUpdate) {
    const updatedName = document.getElementById('name').value;
    const updatedPhone = document.getElementById('phone').value;
    if (updatedName && updatedPhone) {
        postToUpdate.name = updatedName;
        postToUpdate.phone = updatedPhone;
        displayPost();
        start();
        document.getElementById('form').style.display = 'none';
    }
    else {
        alert("Please fill all details.");
    }
}