import { tweetsData as initialTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

let tweetsData =
  JSON.parse(localStorage.getItem('tweetsData')) || initialTweetsData

const saveTweetsData = () => {
  localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
}

saveTweetsData()

document.addEventListener('click', e => {
  const { like, retweet, reply } = e.target.dataset

  if (like) {
    toggleLike(like)
  } else if (retweet) {
    toggleRetweet(retweet)
  } else if (reply) {
    toggleReplyVisibility(reply)
  } else if (e.target.id === 'tweet-btn') {
    addNewTweet()
  }
})

const toggleLike = tweetId => {
  const tweet = tweetsData.find(t => t.uuid === tweetId)

  if (tweet) {
    tweet.isLiked = !tweet.isLiked
    tweet.likes += tweet.isLiked ? 1 : -1
    saveTweetsData()
    renderFeed()
  }
}

const toggleRetweet = tweetId => {
  const tweet = tweetsData.find(t => t.uuid === tweetId)

  if (tweet) {
    tweet.isRetweeted = !tweet.isRetweeted
    tweet.retweets += tweet.isRetweeted ? 1 : -1
    saveTweetsData()
    renderFeed()
  }
}

const toggleReplyVisibility = replyId => {
  const replyContainer = document.getElementById(`replies-${replyId}`)

  if (replyContainer) {
    replyContainer.classList.toggle('hidden')
  }
}

const addNewTweet = () => {
  const tweetInput = document.getElementById('tweet-input')
  const tweetText = tweetInput.value.trim()

  if (tweetText) {
    tweetsData.unshift(createTweetObject(tweetText))
    tweetInput.value = ''
    saveTweetsData()
    renderFeed()
  }
}

const createTweetObject = tweetText => ({
  handle: '@Scrimba',
  profilePic: 'images/scrimbalogo.png',
  likes: 0,
  retweets: 0,
  tweetText,
  replies: [],
  isLiked: false,
  isRetweeted: false,
  uuid: uuidv4(),
})

const generateFeedHtml = () =>
  tweetsData.map(tweet => createTweetHtml(tweet)).join('')

const createTweetHtml = tweet => `
  <div class="tweet">
    <div class="tweet-inner">
      <img src="${tweet.profilePic}" class="profile-pic">
      <div>
        <p class="handle">${tweet.handle}</p>
        <p class="tweet-text">${tweet.tweetText}</p>
        <div class="tweet-details">
          ${generateTweetDetailsHtml(tweet)}
        </div>
      </div>
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
      ${generateRepliesHtml(tweet.replies)}
    </div>
  </div>
`

const generateTweetDetailsHtml = tweet => `
  <span class="tweet-detail">
    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
    ${tweet.replies.length}
  </span>
  <span class="tweet-detail">
    <i class="fa-solid fa-heart ${tweet.isLiked && 'liked'}" data-like="${
  tweet.uuid
}"></i>
    ${tweet.likes}
  </span>
  <span class="tweet-detail">
    <i class="fa-solid fa-retweet ${
      tweet.isRetweeted && 'retweeted'
    }" data-retweet="${tweet.uuid}"></i>
    ${tweet.retweets}
  </span>
`

const generateRepliesHtml = replies =>
  replies
    .map(
      reply => `
        <div class="tweet-reply">
          <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
            <div>
              <p class="handle">${reply.handle}</p>
              <p class="tweet-text">${reply.tweetText}</p>
            </div>
          </div>
        </div>
      `
    )
    .join('')

const renderFeed = () => {
  document.getElementById('feed').innerHTML = generateFeedHtml()
}

renderFeed()
