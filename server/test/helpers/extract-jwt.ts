export const extractJWT = (response): string => {
  try {
    // can't recall but seems authentication strategy changes slightly... updating
    const {
      body: { access_token }
    } = response;

    return access_token;
  } catch (e) {
    console.log(e);

    throw new Error(`Could not destructure. Is the server response working?`);
  }
};
