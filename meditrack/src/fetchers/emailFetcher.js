// const email =  fetch("/api/dashboard/getEmail")
//   .then((data) => {
//     return data.json();
//   })
//   .then((result) => {
//     return result;
//   })
//   .catch((error) => {
//     console.error(error);
//   });

 const email = async () => {
  try {
    const result = await fetch("/api/dashboard/getEmail");
    const response = await result.json();
    console.log("+===== response: ", response)
    return response;
  } catch (error) {
    console.error("===== email fetcher error: ", error);
  }
};

// email();
export default email;

// module.exports = { email };
