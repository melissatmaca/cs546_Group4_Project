Website to convert cURL for axios:
    https://curlconverter.com/node-axios/

AudioAve:
This project acts as a companion app to Spotify and offers a variety of different features for the user. These include AI generated playlists, viewing personal statistics, saving playlists, and even a social media aspect, where users can choose to share playlists and view the playlists of others.



How to use AudioAve:
As AudioAve has many different features this section will be broken down into different parts.


Registering/logging in:
The first thing any new user will have to do is to register. Registering can be done by clicking on the link on the login page which is displayed whenever a user attempts to access the site without already having logged in. In order to register,the user will provide a first name (a non-empty string), last name(a non empty string), email (non empty string), username (non empty string), Password(non empty string with at least one uppercase letter, one lower case letter, one special character, and one number), and the confirm password (ensures the password was entered correctly). The user also checks a bo confirming that they are at least 13 years old. After registering, the user is brought back to the login screen where they can then use their newly made username and password to login. After logging in with their audioave account, the user will be prompted to login to their spotify account. Once this is done the user is left on the social feed section.

Social feed:
The social feed shows any recently shared playlists. users are able to view the shared playlists title, description, the first few songs in the playlist, like the playlists( in doing so the liked count increases), leave a comment on the playlist, and view the playlist. If the user clicks on the playlist, they are brought to that playlists page where they can still likethe playlist and view info on the playlist. The user can also save others playlists to their own spotify from this page.

Playlist generation:
In order to access playlist generation, the user must click on the generator link towards the top of the screen. Once on this screen the user can enter a name for their playlist, a caption for their playlist, a mood(or choose no mood), and at least fill out one of the two genre options. Once all the correct option are filled out, the user presses the generate button below the form. 
Once this button is pressed, the playlist is automatically generated from the answer filled in on the last page. The user is brought to the playlist screen and a few options are available for that playlist. The first is a save to spotify button where the user can add the newly generated playlist directly to their spotify account. Selecting this brings up a confirmation screen where the user can then select their next location using one of the available links. The next option is the post playlist button. This makes the playlist visible to others through the social feed. Once this button is pressed, the playlist is shared, and the button switches to unpost playlist, which unshares the playlist. The final option is to delete the playlist which deletes the playlist from the database and removes it from your created playlists.

Profile: On the profile page, the user sees a breakdown of their spotify analytics. This info includes their AudioAve username, their spotify username, their top tracks, their top artists, a breakdown of their most listened to genres, their generated playlists, and their liked playlists. The top tracks, top artists, and genre breakdown is only available to accounts who posses spotify premium. The user can select any playlists they created or liked from this page and this will bring them to that playlists page.

Logout:
The logout button simply logs the user out and returns them to the login screen where they can choose to login or register a new account.


Testing:
We have created a seed file to make testing easier. this can be run using "npm seed". This seed file adds 4 accounts and 

Credits:
Melissa Atmaca, Cade Cermak, Alvin Radoncic, Joseph Trobiano, Bernard Vitale