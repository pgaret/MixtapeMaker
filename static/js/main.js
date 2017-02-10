var videoPlayer

function onYouTubeIframeAPIReady(){
  player = new YT.Player('0',{
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  })
}
