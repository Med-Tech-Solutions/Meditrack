README:

Based on the currently written schema and the desire to keep the backend written as DRY as possible, this app relies heavily on updating via a POST to the patientsArray property on a User's document. Separate collections may allow for more CRUD functionality with reduced array drilling on the frontend.