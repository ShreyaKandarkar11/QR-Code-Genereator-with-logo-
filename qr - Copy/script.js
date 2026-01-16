let qrCode = new QRCodeStyling({
  width: 220,
  height: 220,
  data: "",
  image: "",
  dotsOptions: {
    color: "#ffffff",
    type: "rounded"
  },
  backgroundOptions: {
    color: "transparent"
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 6
  }
});

qrCode.append(document.getElementById("qrCode"));

function generateQR() {
  const text = document.getElementById("qrText").value;
  const logo = document.getElementById("logoUpload").files[0];
  const wrapper = document.getElementById("qrWrapper");

  if (!text) {
    alert("Please enter text or URL");
    return;
  }

  if (logo) {
    const reader = new FileReader();
    reader.onload = () => {
      qrCode.update({
        data: text,
        image: reader.result
      });
      wrapper.classList.add("show");
    };
    reader.readAsDataURL(logo);
  } else {
    qrCode.update({
      data: text,
      image: ""
    });
    wrapper.classList.add("show");
  }
}

function downloadQR() {
  qrCode.download({
    name: "aesthetic-qr-code",
    extension: "png"
  });
}
