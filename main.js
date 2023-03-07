const videosContainer = document.getElementById('videosContainer');
const videoPopup = document.getElementById('videoPopup');
const videoYt = document.querySelector('#videoPopup > iframe');
const searchInput = document.querySelector("[data-search]")

let videos = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form').addEventListener('submit', addVideo);
});

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    videos.forEach(video => {
        const isVisible = video.title.toLowerCase().includes(value) || video.note.toLowerCase().includes(value);
        if (!isVisible) {
            document.getElementById(`list-element-${video.id}`).classList.add("hide");
        }else {
            document.getElementById(`list-element-${video.id}`).classList.remove("hide");
        }
    });
});

function loadVideos() {
    videos = JSON.parse(localStorage.getItem('videoList')) || [];
};

function addVideo(ev) {
    ev.preventDefault();
    let video = {
        id: document.getElementById('videoId').value,
        title: document.getElementById('videoTitle').value,
        note: document.getElementById('note').value
    }

    if (videos.some(element => element.id === document.getElementById('videoId').value)) {
        alert('Video with this ID is already saved!');
    } else {
        videos.unshift(video);
    }

    document.forms[0].reset();
    localStorage.setItem('videoList', JSON.stringify(videos));
    displayVideos();
    document.getElementById('current').innerHTML = "0";
    document.getElementById('current').style.color ="white";
};

function displayVideos() {
    const videosHTMLString = videos.map(
        ({id,title,note}) =>
        `<li class="ytVideo" id="list-element-${id}">
        <div class="thumb">
            <img class="thumbnail"" id="${id}" onclick="openVideoPopup()" src="https://i3.ytimg.com/vi/${id}/mqdefault.jpg">
            <button class="remove-btn" id="${id}"> &times;</button>
        </div>
            <h1>${title}</h1>
            <p>${note}</p>
            </div>
        </li>`
    )
    .join("");
    videosContainer.innerHTML = videosHTMLString;
    triggerRemoveButton();
};

function triggerRemoveButton() {
    let removeBtns = document.querySelectorAll('.remove-btn');
    for(let i = 0; i < removeBtns.length; i++){
        let button = removeBtns[i]
        button.addEventListener('click', function(event) {
            var result = confirm('Are you sure? This video will be deleted');
            if (result === false) {
                return;
            }else {
                let id = event.target.id
                videos = videos.filter(item => item.id !== id);
                localStorage.setItem('videoList', JSON.stringify(videos));
                displayVideos();
            }
       });
    }; 
};

function closeVideoPopup() {
    videoPopup.classList.add('closed');
    videoPopup.classList.remove('open');
    videoYt.src = "";
};

function openVideoPopup() {
    let thumbNail = document.querySelectorAll('.thumbnail');
    for(let i = 0; i < thumbNail.length; i++){
        let thumb = thumbNail[i]
        thumb.addEventListener('click', function(event) {
            const { id } = event.target
            videoPopup.classList.add('open');
            videoPopup.classList.remove('closed')
            videoYt.src = `https://www.youtube.com/embed/`+ id;
       });
    }; 
};

function count(obj) {
    const currentCharsNum = document.getElementById('current');
    currentCharsNum.innerHTML = obj.value.length;
    if(obj.value.length === 100) {
        currentCharsNum.style.color ="red";
    } else {
        currentCharsNum.style.color ="white";
    }
};

loadVideos();
displayVideos();