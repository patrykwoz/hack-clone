"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  hidePageComponents();
  $storiesContainer.show();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  hidePageComponents();
  $storiesContainer.hide();
  $loginForm.show();
  const loginForm = document.getElementById('login-form');
  loginForm.reset();

  
  
  $signupForm.show();
  const signupForm = document.getElementById('signup-form');
  signupForm.reset();
  const warningMessage = document.querySelector('div.warning-message');
  if(warningMessage){
    warningMessage.remove();
  }

  
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


function navNewStoryClick(evt){
  hidePageComponents();
  $storyForm.show();
  putStoriesOnPage();
}

$navNewStory.on('click', navNewStoryClick);

function favoritesClick(evt){
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorites.on('click', favoritesClick);

function myStoriesClick(evt){
  hidePageComponents();
  putUserStoriesOnPage();
}

$navMyStories.on('click', myStoriesClick);


function showEditStory(e){
  document.querySelector('#edit-story-form').reset();
  const storyId = e.target.closest('li').id;

  const story = currentUser.ownStories.filter(story => story.storyId === storyId)[0];

  const inputStoryId = document.querySelector('#edit-story-story-id')
  const inputStoryAuthor = document.querySelector('#edit-story-author')
  const inputStoryTitle = document.querySelector('#edit-story-title')
  const inputStoryUrl = document.querySelector('#edit-story-url')

  inputStoryId.value = storyId;
  inputStoryAuthor.value = story.author;
  inputStoryTitle.value = story.title;
  inputStoryUrl.value = story.url;

  hidePageComponents();
  $storyEditForm.show();
  putStoriesOnPage();
}

$allStoriesList.on('click', '.edit-story-btn', showEditStory);

function showEditProfile(e){
  const editUserForm = document.getElementById('edit-user-form');
  editUserForm.reset();
  document.querySelector('#edit-name').value = currentUser.name;
  document.querySelector('#edit-username').value = currentUser.username;
  

  hidePageComponents();
  $storiesContainer.hide();
  $editUserForm.show();


}

$navUserProfile.on('click', showEditProfile)