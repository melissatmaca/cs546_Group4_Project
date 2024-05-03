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
      if (commentText && commentText !== "Write a comment...") {
        // AJAX POST request to handle comment submission
        $.ajax({
          url: `/api/playlist/${playlistId}/comment`,
          method: "POST",
          data: { comment: commentText },
          success: function (response) {
            // Assuming response returns the newly added comment details
            const commentsContainer = $(
              `[data-comment-id="${playlistId}-comments"]`
            );
            const newComment = response.comment; // assuming the server responds with the new comment data
            const commentHtml = `<div class="comment" id="${newComment._id}">
                        <p>${newComment.author}: ${newComment.comment}</p>
                        <p>${newComment.postDate}</p>
                    </div>`;
            commentsContainer.append(commentHtml); // Append the new comment to the comments container
            $(".comment-form textarea").val(""); // Clear the textarea after submitting
          },
          error: function () {
            alert("Error submitting comment.");
          },
        });
      } else {
        alert("Please write a comment.");
      }
    });

    // Handling textarea for removing default text on focus, and adding it when not focused
    $(".playlist").on("focus", "textarea", function () {
      if (this.value === "Write a comment...") {
        this.value = "";
      }
    });

    $(".playlist").on("blur", "textarea", function () {
      if (this.value === "") {
        this.value = "Write a comment...";
      }
    });
  });
})(window.jQuery);
