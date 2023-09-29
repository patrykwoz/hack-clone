"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;


/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  $storiesContainer.show();

  putStoriesOnPage();
}



/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  const starClass = returnStarClass(story);
  const editStoryBtn = returnEditBtn(story);
  return $(`
      <li id="${story.storyId}">
        <div>
              
          <span class="trash-can hidden"><i class="fas fa-trash-alt"></i></span>
          <span class="star hidden"><i class="${starClass} fa-star"></i></span>
          <div>
            <div>
              <a href="${story.url}" target="a_blank" class="story-link">
                ${story.title}
              </a>
              <small class="story-hostname">(${hostName})</small>
              ${editStoryBtn}
            </div>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
          </div>
        </div>
        <hr>
      </li>
      
    `);
}

function updateStoriesOnPage(){
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  showStars();
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $storiesContainer.show();
  $allStoriesList.show();
  showStars();
}

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();
  const favoritesIds = currentUser.favorites.map(favorite => favorite.storyId);
  const favoriteStories = storyList.stories.filter(story=> favoritesIds.includes(story.storyId));

  for (let story of favoriteStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  showStars();
  $warningMessages.hide();
}

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $allStoriesList.empty();
  const userStoriesIds = currentUser.ownStories.map(ownStory => ownStory.storyId);
  const userStories = storyList.stories.filter(story=> userStoriesIds.includes(story.storyId));

  for (let story of userStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  showTrashCans();
  showStars();
}


$storyForm.on('submit', handleSubmitStory)

async function handleSubmitStory(evt){
  evt.preventDefault();
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  const newStory = {author, title, url};
  await storyList.addStory(currentUser, newStory);
  await currentUser.updateStories();
  await getAndShowStoriesOnStart();
  $storyForm.hide();

}

$storyEditForm.on('submit', handleEditStory)

async function handleEditStory(evt) {
  evt.preventDefault();
  const id = $("#edit-story-story-id").val();
  const author = $("#edit-story-author").val();
  const title = $("#edit-story-title").val();
  const url = $("#edit-story-url").val();

  const editedStory = {author, title, url};
  await storyList.editStory(currentUser, id, editedStory);
  await currentUser.updateStories();
  await getAndShowStoriesOnStart();
  $storyEditForm.hide();
}


function returnStarClass(story){
  if (!currentUser){
    return 'far'
  }
  const filteredArr = currentUser.favorites.filter(item => item.storyId === story.storyId);
  if (filteredArr.length>0){
    return 'fas'
  } else{
    return 'far'
  }

}

function showStars(){
  if(currentUser){
    $('.star').show();
  }else{
    return
  }
}

function showTrashCans(){
  if(currentUser){
    $('.trash-can').show();
  }else{
    return
  }
}

function returnEditBtn(story){
  if (!currentUser){
    return ''
  }
  const filteredArr = currentUser.ownStories.filter(item => item.storyId === story.storyId);
  if (filteredArr.length>0){
    return '<button class="edit-story-btn">Edit</button>';
  } else{
    return '';
  }
}

function showEditButtons(){
  if(currentUser){
    $('.edit-story-btn').show();
  }else{
    return
  }
}


$allStoriesList.on('click','span.star', handleStarClick)

async function handleStarClick(e){

  const clickedId = e.target.parentElement.parentElement.parentElement.id;
  const filteredArr = currentUser.favorites.filter(item => item.storyId === clickedId);
  let myStar = $(e.target).get()[0];

  if (filteredArr.length>0){
    await removeFavorite(clickedId)
    myStar.classList.remove('fas');
    myStar.classList.add('far');

  }else{
    await addFavorite(clickedId);
    myStar.classList.remove('far');
    myStar.classList.add('fas');
  }
}


$allStoriesList.on('click','span.trash-can', handleTrashClick)

async function handleTrashClick(e){
  const clickedTrash = e.target.closest('li')
  const clickedId = clickedTrash.id;
  
  await removeOwnStory(clickedId);
  storyList.removeStory(clickedId);
  clickedTrash.remove();
}