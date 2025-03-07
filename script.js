// Current song
let songsList = [];
let songs = [];
let currfolder;
let currentSong = new Audio();

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

async function getSongs(folder) {
  currfolder = folder;
  let as = await fetch(`/Spotify-Clone/songs/${folder}/`);
  let response = await as.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let listItems = div.getElementsByTagName("li");
  songsList = [];

  for (let li of listItems) {
    let anchor = li.querySelector("a");
    if (anchor) {
      let songName = decodeURIComponent(anchor.href.split("/").pop());

      // ✅ Filter out non-song items
      if (
        songName.toLowerCase().endsWith(".mp3") ||
        songName.toLowerCase().endsWith(".wav")
      ) {
        songsList.push(songName);
      }
    }
  }

  // ✅ Prevent empty entries
  songsList = songsList.filter((song) => song.trim() !== "");

  let songUl = document.querySelector(".songList ul");
  songUl.innerHTML = ""; // Clear previous list

  for (const song of songsList) {
    songUl.innerHTML += `
      <li class="song-item">
        <img class="invert music" src="svgs/music.svg" alt="">
        <div class="info">
          <div class="song-name">${song}</div>
          
        </div>
        <div class="playnow">
          
          <img id="#play" class="invert play-btn" src="svgs/play.svg" alt="">
        </div>
      </li>`;
  }

  // Attach event listeners after updating the list
  document.querySelectorAll(".song-item").forEach((item) => {
    item.addEventListener("click", () => {
      let songName = item.querySelector(".song-name").innerText.trim();
      // Check if it's the same song and toggle pause/play
      if (currentSong.src.includes(songName)) {
        if (currentSong.paused) {
          currentSong.play();
          document.querySelector("#play").src = "svgs/pause.svg";
          item.querySelector(".play-btn").src = "svgs/pause.svg";
        } else {
          currentSong.pause();
          document.querySelector("#play").src = "svgs/play.svg";
          item.querySelector(".play-btn").src = "svgs/play.svg";
        }
      } else {
        playMusic(songName); // Start new song
      }
    });
  });
}

// Attach event listener to each song item
document.querySelectorAll(".song-item").forEach((item) => {
  item.addEventListener("click", () => {
    let songName = item.querySelector(".song-name").innerText.trim();
    // Check if it's the same song and toggle pause/play
    if (currentSong.src.includes(songName)) {
      if (currentSong.paused) {
        currentSong.play();
        document.querySelector("#play").src = "svgs/pause.svg";
        item.querySelector(".play-btn").src = "svgs/pause.svg";
      } else {
        currentSong.pause();
        document.querySelector("#play").src = "svgs/play.svg";
        item.querySelector(".play-btn").src = "svgs/play.svg";
      }
    } else {
      playMusic(songName); // Start new song
    }
  });
});

const playMusic = (track, pause = false) => {
  currentSong.src = `${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
  }
  // Update main play button
  document.querySelector("#play").src = pause
    ? "svgs/play.svg"
    : "svgs/pause.svg";

  // Update song item buttons
  document.querySelectorAll(".song-item").forEach((item) => {
    let songName = item.querySelector(".song-name").innerText.trim();
    let playBtn = item.querySelector(".play-btn");

    if (songName === track) {
      playBtn.src = pause ? "svgs/play.svg" : "svgs/pause.svg"; // Sync with main play button
      playBtn.style.scale = 1.2;
      playBtn.style.transition = "all 0.2s ease";
      playBtn.style.filter =
        "brightness(0) saturate(100%) invert(60%) sepia(80%) saturate(400%) hue-rotate(85deg) brightness(120%) contrast(95%)";
    } else {
      playBtn.src = "svgs/play.svg"; // Reset other buttons
      playBtn.style.scale = 1;
      playBtn.style.filter =
        "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)"; // Resets to white
    }
  });
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// Display all albums dynamically on the page
async function displayAlbums() {
  let as = await fetch(`/Spotify-Clone/songs/`);
  let response = await as.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = ""; // Clear existing content to prevent duplication

  for (let e of anchors) {
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-1)[0];
      console.log("Extracted folder:", folder);

      let infoJsonUrl = `/Spotify-Clone/songs/${folder}/info.json`;
      try {
        let as = await fetch(infoJsonUrl);
        if (!as.ok) throw new Error(`⚠️ info.json not found for ${folder}`);
        let responses = await as.json();

        // ✅ Dynamically create a card with the correct folder name
        let cardHTML = `
          <div data-folder="${folder}" class="card m-1 rounded">
              <div class="play">
                  <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="45" fill="#1fdf64" />
                      <polygon points="40,30 40,70 70,50" fill="black" />
                  </svg>
              </div>
              <div class="card-img">
                  <img src="songs/${folder}/${responses.imgCover}" alt="${responses.title}">
              </div>
              <h2>${responses.title}</h2>
              <p>${responses.artist}</p>
          </div>`;

        cardContainer.insertAdjacentHTML("beforeend", cardHTML);
      } catch (error) {
        console.error("❌ Error fetching JSON:", error);
      }
    }
  }

  // ✅ Attach event listener **AFTER** dynamically adding cards
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", async (event) => {
      let folder = event.currentTarget.dataset.folder;
      console.log(`📂 Loading songs from: ${folder}`);
      await getSongs(`songs/${folder}`);
      songs = [...songsList]; // Update songs list
      playMusic(songs[0]); // Play the first song
    });
  });
}

async function main() {
  await getSongs(`/Spotify-Clone/songs/Glory/`);
  songs = [...songsList]; // Ensure songs get updated
  if (!songs.length) return;

  playMusic(songs[0], true); // stop the autoplay

  //  Display all ablums dynamically on the pages
  displayAlbums();

  document.querySelector("#play").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.querySelector("#play").src = "svgs/pause.svg";
    } else {
      currentSong.pause();
      document.querySelector("#play").src = "svgs/play.svg";
    }

    // Find the currently playing song and update its play button in the song list
    document.querySelectorAll(".song-item").forEach((item) => {
      let songName = item.querySelector(".song-name").innerText.trim();
      let playBtn = item.querySelector(".play-btn");

      if (currentSong.src.includes(songName)) {
        playBtn.src = currentSong.paused ? "play.svg" : "pause.svg";
      }
    });
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let present = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = present + "%";
    currentSong.currentTime = (currentSong.duration * present) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  document.querySelector("#previous").addEventListener("click", () => {
    let currentSongName = decodeURIComponent(currentSong.src.split("/").pop());
    let index = songs.indexOf(currentSongName); // ✅ Use songs array

    if (index > 0) {
      playMusic(songs[index - 1]); // ✅ Play previous song
    }
  });

  document.querySelector("#next").addEventListener("click", () => {
    let currentSongName = decodeURIComponent(currentSong.src.split("/").pop());
    let index = songs.indexOf(currentSongName);

    if (index !== -1 && index < songs.length - 1) {
      playMusic(songs[index + 1]); // ✅ Play next song
    }
  });
  currentSong.addEventListener("ended", () => {
    let currentSongName = decodeURIComponent(currentSong.src.split("/").pop());
    let index = songs.indexOf(currentSongName); // ✅ Get current song index

    if (index !== -1 && index < songs.length - 1) {
      playMusic(songs[index + 1]); // ✅ Play next song
    } else {
      playMusic(songs[0]); // ✅ Loop back to first song if it's the last one
    }
  });

  // Add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      // console.log(e);
      // console.log(e.target.onscroll);
      console.log("Setting volume to", e.target.value, "/ 100");
      currentSong.volume = parseInt(e.target.value) / 100;
      if (currentSong.volume > 0) {
        document.querySelector(".volume>img").src = document
          .querySelector(".volume>img")
          .src.replace("svgs/mute.svg", "svgs/volume.svg");
      }
      // Dynamically update track fill color
      let percentage = e.target.value + "%";
      console.log(percentage);
      e.target.style.background = `linear-gradient(to right, #1fdf64 ${percentage}, #444 ${percentage})`;
    });

  // Add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("svgs/volume.svg", "svgs/mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("svgs/mute.svg", "svgs/volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

main();
