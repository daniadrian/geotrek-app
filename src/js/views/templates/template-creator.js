// src/js/views/templates/template-creator.js

// src/js/views/templates/template-creator.js
const createStoryItemTemplate = (story) => `
  <a href="#/detail/${story.id}" class="story-item-link">
    <article class="story-item">
      <img src="${story.photoUrl}" alt="Story image by ${
  story.name
}" class="story-item__image">
      <div class="story-item__content">
        <h3 class="story-item__name">${story.name}</h3>
        <p class="story-item__description">${story.description}</p>
        <p class="story-item__date">${new Date(
          story.createdAt
        ).toLocaleDateString()}</p>
      </div>
    </article>
  </a>
`;

export { createStoryItemTemplate };
