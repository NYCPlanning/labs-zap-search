export const extractJWT = (response): string => {
  try { 
    // seems like the actual cookie is always the second in the array
    const { header: { 'set-cookie': [, token] } } = response;

    return token;
  } catch (e) {
    console.log(e);

    throw new Error(`Could not destructure. Is the server response working?`);
  }
};
