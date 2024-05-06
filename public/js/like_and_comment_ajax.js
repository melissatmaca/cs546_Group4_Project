(function ($) {
  $(document).ready(function () {
    // Event handler for like button clicks
    $(".playlist").on("click", ".like-button", function (e) {
      e.preventDefault(); // Prevent default action of the button (form submission)
      const playlistId = $(this).data("like-id").replace("-like", ""); // Extract playlist ID from the button's data attribute

      // AJAX POST request to handle likes
      $.ajax({
        url: `/api/playlist/${playlistId}/like`,
        method: "POST",
        success: function (response) {
          //console.log(response)
          // Response should contrain the updated likes count
          $(`[data-count-id="${playlistId}-count"]`).text(
            response.likes.length
          );
        },
        error: function () {
          alert("Error liking the playlist.");
        },
      });
    });

    // Event handler for submitting comments
    $(".playlist").on("submit", "form", function (e) {
      e.preventDefault(); // Prevent default form submission
      const playlistId = $(this)
        .find("textarea")
        .data("newcomment-id")
        .replace("-new-comment", "");
      const commentText = $(this).find("textarea").val();

      // Check if the comment is not just the placeholder or empty
      if (commentText.trim()) {
        // AJAX POST request to handle comment submission
        $.ajax({
          url: `/api/playlist/${playlistId}/comment`,
          method: "POST",
          data: { comment: commentText },
          success: function (response) {
            const commentsContainer = $(`[data-comment-id="${playlistId}-comments"]`);
            const commentForm = commentsContainer.find('form');
            const newComment = response.comments;
          
            // const commentHtml = `<div class="comment" id="${newComment._id}">
            //                 <p>${encodeHtml(newComment.author)}: ${encodeHtml(newComment.comment)}</p>
            //                 <p>${newComment.postDate}</p>
            //             </div>`;

            // comment elements to look like the above html
            const commentDiv = $('<div class="comment">').attr('id', newComment._id);
            const authorText = $('<p>').text(newComment.author + ": " + newComment.comment); // prevent HTML from rendering with .text()
            const postDateText = $('<p>').text(newComment.postDate);
            commentDiv.append(authorText).append(postDateText);

            // Insert the new comment directly before the form
            commentForm.before(commentDiv); // Insert the new comment directly before the form
            $(".comment-form textarea").val(""); // Clear the textarea after submitting
            // if this is the first ever comment, remove _id-no-comment p-tag
            if ($(`#${playlistId}-no-comment`).length) {
              $(`#${playlistId}-no-comment`).remove();
            }
          },
          error: function () {
            alert("Error submitting comment");
          },
        });
      } else {
        alert("Please write a non-empty comment");
      }
    });

    // Handling textarea for removing default text on focus, and adding it when not focused
    $(".playlist").on("focus", "textarea", function () {
      if (this.placeholder === "Write a comment...") {
        this.placeholder = "";
      }
    });

    $(".playlist").on("blur", "textarea", function () {
      if (this.value === "") {
        this.placeholder = "Write a comment...";
      }
    });
  });
})(window.jQuery);
