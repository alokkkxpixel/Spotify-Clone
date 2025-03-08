// Current song
let songsList = [];
let songs = [];
let currfolder;
let currentSong = new Audio();

console.log("code running");

//  manifest for songs and album metadata
const songsManifest = {
  "songs/Glory": [
      "Bonita - Yo Yo Honey Singh, The Shams.mp3",
      "Jatt Mehkma - Yo Yo Honey Singh, Leo Grewal.mp3",
      "Maniac - Yo Yo Honey Singh.mp3",
      "Millionaire-Yo Yo Honey Singh, Leo Grewal.mp3",
      "Payal - Yo Yo Honey Singh, Paradox,.mp3",
      "Rap God - Honey Singh.mp3"
  ],
  "Divine": [
      "100 Million - DIVINE Karan Aujla.mp3",
      "Hisaab - DIVINE Karan Aujla.mp3",
      "Nothing Lasts - DIVINE Karan Aujla.mp3",
      "Straight Ballin - DIVINE Karan Aujla.mp3",
      "Top Class  Overseas - DIVINE Karan Aujla.mp3",
      
  ],
  "yjhd": [
      "Balam Pichkari.mp3",
      "Badtameez Dil - Benny Dayal Shefali Alvares.mp3",
      "Diliwali Girlfriends.mp3",
      "ILAHI - Arijit Singh, Pritam, Amitbh Bhattacharya.mp3",
      "Kabira - Tochi Raina Rekha Bhardwaj.mp3",
  ],
  "Krsna":[
    "Hola Amigo - KRNA, Seedhe Maut, Umair.mp3",
    "KRNA, Flexus, KRNA, Flexus - Blowing Up.mp3",
    "KRNA, KRNA, KRNA, Enigma - No Cap.mp3",
    "KRNA, KRNA, KRNA, Kabu Beats - I Guess.mp3",


  ],


};

const albumsManifest = {
  "Glory": {
          "title": "Glory",
          "artist": "YO Yo Honey Singh",
          "album": "Glory",
          "imgCover": "/Glory-cover.webp"


  },
  "Krsna": {
    "title": "FAR FROM OVER",
    "artist": "KR$NA",
    "album": "NGL",
    "imgCover": "/Krsna.webp"
  },
  "Divine": {
    "title": "Street Dreams",
    "artist": "Divine",
    "album": "Street Dreams",
    "imgCover": "/streetDreams.webp",
  },
  "yjhd": {
    "title": "Yeh Jawaani Hai Deewani",
    "artist": "Pritam",
    "album": "Yeh Jawaani Hai Deewani",
    "imgCover": "/yjhd-cover.webp",
  },
};
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

async function getSongs(folder) {
  currfolder = folder;
  songsList = songsManifest[folder] || [];  // ✅ Changed: Fetch songs from the songsManifest instead of using fetch()

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
            <img class="invert play-btn" src="svgs/play.svg" alt="">
          </div>
        </li>`;
  }

  // ✅ Attach event listeners after updating the list
  document.querySelectorAll(".song-item").forEach((item) => {
      item.addEventListener("click", () => {
          let songName = item.querySelector(".song-name").innerText.trim();
          if (currentSong.src.includes(songName)) {
              if (currentSong.paused) {
                  currentSong.play();
                  item.querySelector(".play-btn").src = "svgs/pause.svg";
              } else {
                  currentSong.pause();
                  item.querySelector(".play-btn").src = "svgs/play.svg";
              }
          } else {
              playMusic(songName);
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
console.log("Checking if .cardContainer exists:", document.querySelector(".cardContainer"));

// Display all albums dynamically on the page
async function displayAlbums() {
  console.log("displayAlbums() function is running!"")
    const cardContainer = document.querySelector(".cardContainer");
    
    if (!cardContainer) {
        console.error("❌ cardContainer NOT FOUND!");
        return; // Stop execution if cardContainer is missing
    }

    console.log("✅ cardContainer found!", cardContainer);
    
    cardContainer.innerHTML = ""; // Clear existing albums

    for (const albumKey in albumsManifest) {
        const album = albumsManifest[albumKey];
        
        console.log(`🎵 Adding album: ${albumKey}`, album); // Debug each album
        
        cardContainer.innerHTML += `
        <div data-folder="${albumKey}" class="card">
            <div class="play">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="24" fill="#1DB954" />
                    <path d="M18 34V14L34 24L18 34Z" fill="black" />
                </svg>
            </div>
            <img src="./songs/${albumKey}/cover.jpg" alt="${album.title}">
            <h2>${album.title}</h2>
            <p>${album.artist}</p>
        </div>`;
    }

    console.log("✅ Finished adding albums. Total:", Object.keys(albumsManifest).length);

    // ✅ Check if album cards exist after being added
    const cards = document.querySelectorAll(".card");
    console.log("📌 Total album cards in DOM:", cards.length);

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
  console.log("Albums Manifest:", albumsManifest);

  await getSongs(`/songs/Glory/`);
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
