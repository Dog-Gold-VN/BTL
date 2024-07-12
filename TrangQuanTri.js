function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const id = getQueryParam("id");
console.log("ID: ", id);
const API = "http://localhost:3000/listSanPham";
console.log("API: ", API);
console.log(API + "?id=" + id);

document.addEventListener("DOMContentLoaded", function () {
  if (!id || id === "new") {
    alert(
      "Vui lòng đăng nhập để truy cập trang này hoặc không có quyền truy cập."
    );
    return;
  }

  const form = document.getElementById("form");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    dangban();
  });

  hienthi();
  an();
  trangchu();
  hienThiTaiKhoan();
});

async function dangban() {
  if (!id || id === "new") {
    alert(
      "Vui lòng đăng nhập để truy cập trang này hoặc không có quyền truy cập."
    );
    return;
  }

  const name = document.getElementById("name").value;
  const thuonghieu = document.getElementById("thuonghieu").value;
  const loaisanpham = document.getElementById("loaisanpham").value;
  const gia = document.getElementById("gia").value;
  const mota = document.getElementById("mota").value;
  const imgurl = document.getElementById("imgurl").value;
  const sizeS = document.getElementById("sizeS").value || 0;
  const sizeM = document.getElementById("sizeM").value || 0;
  const sizeL = document.getElementById("sizeL").value || 0;
  const sizeXL = document.getElementById("sizeXL").value || 0;
  const color = document.getElementById("color").value;
  const chatlieu = document.getElementById("chatlieu").value;

  const idSanPham = Math.floor(Math.random() * 10000000);
  const idSP = idSanPham.toString();
  const sanphamMoi = {
    idSP,
    name,
    thuonghieu,
    loaisanpham,
    gia: parseInt(gia),
    mota,
    img: imgurl,
    sizeS: parseInt(sizeS),
    sizeM: parseInt(sizeM),
    sizeL: parseInt(sizeL),
    sizeXL: parseInt(sizeXL),
    color,
    chatlieu,
  };

  console.log("SanPham mới:", sanphamMoi);

  try {
    const response = await fetch(`${API}?id=${id}`);
    if (response.ok) {
      const data = await response.json();
      const user = data[0];
      const sanphamsHienCo = user.SanPhams || [];

      sanphamsHienCo.push(sanphamMoi);

      const updatedUser = { ...user, SanPhams: sanphamsHienCo };

      const updateResponse = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (updateResponse.ok) {
        hienthi();
      } else {
        alert("Có lỗi xảy ra khi đăng bán sản phẩm!");
      }
    } else {
      alert("Không thể lấy thông tin sản phẩm hiện có!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi kết nối đến API!");
  }
}

async function hienthi() {
  try {
    const response = await fetch(`${API}?id=${id}`);
    if (response.ok) {
      const data = await response.json();
      console.log("data: ", typeof data, data);

      const listSanPhamDiv = document.getElementById("list-sanpham");
      listSanPhamDiv.innerHTML = "";

      data[0].SanPhams.forEach((sanpham) => {
        const sanphamDiv = document.createElement("div");
        sanphamDiv.classList.add("sanpham-card");

        sanphamDiv.innerHTML = `
          <h2 class="sanpham-name">${sanpham.name}</h2>
          <p><strong>Số lượng:</strong> ${
            sanpham.sizeL + sanpham.sizeM + sanpham.sizeS + sanpham.sizeXL
          }</p>
          <p><strong>Giá:</strong> ${sanpham.gia.toLocaleString(
            "vi-VN"
          )} VND</p>
          <p><strong>Mô tả:</strong> ${sanpham.mota}</p>
          <p><strong>Thương hiệu:</strong> ${sanpham.thuonghieu}</p>
          <p><strong>Loại sản phẩm:</strong> ${sanpham.loaisanpham}</p>
          <p><strong>Màu sắc:</strong> ${sanpham.color}</p>
          <p><strong>Chất liệu:</strong> ${sanpham.chatlieu}</p>
          <p><strong>Kích cỡ:</strong> S - ${sanpham.sizeS}, M - ${
          sanpham.sizeM
        }, L - ${sanpham.sizeL}, XL - ${sanpham.sizeXL}</p>
          <img src="${sanpham.img}" alt="${sanpham.name}" class="sanpham-img">
          <div class="sanpham-buttons">
            <button class="sanpham-btn" onclick="deleteProduct('${
              sanpham.idSP
            }')">Xóa</button>
            <button class="sanpham-btn" onclick="editProduct('${
              sanpham.idSP
            }')">Sửa</button>
          </div>
        `;

        listSanPhamDiv.appendChild(sanphamDiv);
      });
    } else {
      console.error("Không thể lấy thông tin sản phẩm!");
    }
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

function dangbanButton() {
  dangban();
  alert("Đăng bán sản phẩm thành công!");
}

function editProduct(idSP) {
  fetch(`http://localhost:3000/listSanPham?id=${id}`)
    .then((response) => response.json())
    .then((data) => {
      const user = data[0];
      const sanpham = user.SanPhams.find((sp) => sp.idSP === idSP);

      if (sanpham) {
        document.getElementById("name").value = sanpham.name;
        document.getElementById("thuonghieu").value = sanpham.thuonghieu;
        document.getElementById("loaisanpham").value = sanpham.loaisanpham;
        document.getElementById("gia").value = sanpham.gia;
        document.getElementById("mota").value = sanpham.mota;
        document.getElementById("imgurl").value = sanpham.img;
        document.getElementById("sizeS").value = sanpham.sizeS;
        document.getElementById("sizeM").value = sanpham.sizeM;
        document.getElementById("sizeL").value = sanpham.sizeL;
        document.getElementById("sizeXL").value = sanpham.sizeXL;
        document.getElementById("color").value = sanpham.color;
        document.getElementById("chatlieu").value = sanpham.chatlieu;

        const form = document.getElementById("form");
        form.onsubmit = function (event) {
          event.preventDefault();
          updateProduct(idSP);
        };
      } else {
        alert("Không tìm thấy sản phẩm cần sửa!");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function updateProduct(idSP) {
  const name = document.getElementById("name").value;
  const thuonghieu = document.getElementById("thuonghieu").value.trim();
  const loaisanpham = document.getElementById("loaisanpham").value;
  const gia = document.getElementById("gia").value;
  const mota = document.getElementById("mota").value;
  const imgurl = document.getElementById("imgurl").value;
  const sizeS = document.getElementById("sizeS").value || 0;
  const sizeM = document.getElementById("sizeM").value || 0;
  const sizeL = document.getElementById("sizeL").value || 0;
  const sizeXL = document.getElementById("sizeXL").value || 0;
  const color = document.getElementById("color").value;
  const chatlieu = document.getElementById("chatlieu").value;

  const sanphamMoi = {
    idSP,
    name,
    thuonghieu,
    loaisanpham,
    gia: parseInt(gia),
    mota,
    img: imgurl,
    sizeS: parseInt(sizeS),
    sizeM: parseInt(sizeM),
    sizeL: parseInt(sizeL),
    sizeXL: parseInt(sizeXL),
    color,
    chatlieu,
  };

  fetch(`http://localhost:3000/listSanPham?id=${id}`)
    .then((response) => response.json())
    .then((data) => {
      const user = data[0];
      const sanphams = user.SanPhams.map((sp) =>
        sp.idSP === idSP ? sanphamMoi : sp
      );

      const updatedUser = { ...user, SanPhams: sanphams };

      fetch(`http://localhost:3000/listSanPham/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => {
          if (response.ok) {
            hienthi();
          } else {
            alert("Có lỗi xảy ra khi cập nhật sản phẩm!");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Có lỗi xảy ra khi kết nối đến API!");
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function deleteProduct(idSP) {
  const confirmation = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
  if (confirmation) {
    fetch(`http://localhost:3000/listSanPham?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        const user = data[0];
        const sanphams = user.SanPhams.filter((sp) => sp.idSP !== idSP);

        const updatedUser = { ...user, SanPhams: sanphams };

        fetch(`http://localhost:3000/listSanPham/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        })
          .then((response) => {
            if (response.ok) {
              alert("Sản phẩm đã được xóa thành công!");
              hienthi();
            } else {
              alert("Có lỗi xảy ra khi xóa sản phẩm!");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Có lỗi xảy ra khi kết nối đến API!");
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function trangchu() {
  const trangchuLink = document.getElementById("trangchu");
  trangchuLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (id) {
      window.location.href = `index.html?id=${id}`;
    } else {
      console.error("Không có ID để chuyển hướng.");
    }
  });
}

async function hienThiTaiKhoan() {
  if (id) {
    try {
      const response = await fetch(`${API}?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("data: ", typeof data, data);

        if (data.length > 0) {
          const user = data[0];

          const taikhoanDiv = document.querySelector(".taikhoan");
          taikhoanDiv.innerHTML = `
            <div class="text">
              ${user.nameUser}
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="select">
              <a href="TrangQuanTri.html">Đăng Xuất</a>
            </div>
          `;
          console.log("Lấy thông tin thành công");
          console.log("username: ", user.nameUser);
        } else {
          console.error("Không tìm thấy người dùng với ID này!");
        }
      } else {
        console.error("Không thể lấy thông tin người dùng!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  }
}

function an() {
  const buttonAn = document.getElementById("button-an");
  buttonAn.addEventListener("click", function () {
    const form = document.getElementById("section");
    if (form.style.display === "none") {
      form.style.display = "block";
      buttonAn.textContent = "Ẩn";
      buttonAn.style.backgroundColor = "#ff0000";
    } else {
      form.style.display = "none";
      buttonAn.textContent = "Hiện";
      buttonAn.style.backgroundColor = "rgb(2, 175, 2)";
      buttonAn.style.marginBottom = "20px";
    }
  });
}
