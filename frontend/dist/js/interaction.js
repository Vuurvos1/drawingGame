const copyLinkButton = document.querySelector('.button--copyLink');

// copy game room url
copyLinkButton.addEventListener('click', () => {
  const text = roomTxt.value;

  // Create a fake textarea
  const textAreaEle = document.createElement('textarea');

  // Reset styles
  textAreaEle.style.border = '0';
  textAreaEle.style.padding = '0';
  textAreaEle.style.margin = '0';

  // Set the absolute position
  // User won't see the element
  textAreaEle.style.position = 'absolute';
  textAreaEle.style.left = '-9999px';
  textAreaEle.style.top = `0px`;

  // Set the value
  textAreaEle.value = text;

  // Append the textarea to body
  document.body.appendChild(textAreaEle);

  // Focus and select the text
  textAreaEle.focus();
  textAreaEle.select();

  // Execute the "copy" command
  try {
    document.execCommand('copy');
  } catch (err) {
    // Unable to copy
  } finally {
    // Remove the textarea
    document.body.removeChild(textAreaEle);
  }
});
