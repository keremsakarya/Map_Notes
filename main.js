import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { detecType } from './helper.js';
import { setStorage } from './helper.js';
import { detectIcon } from './helper.js';

//! HTML den gelenler
const form = document.querySelector("form")
const list = document.querySelector("ul")

//! Olay izleyicileri
form.addEventListener("submit", handleSubmit)
list.addEventListener("click", handleClick)

//! Ortak kullanım alanı
var map
var layerGroup = []
var notes = JSON.parse(localStorage.getItem("notes")) || []
var coords = []

//? Kullanıcının konumunu öğrenmek için getCurrentPosition yöntemi kullanıldı
navigator.geolocation.getCurrentPosition(loadMap, errorFunction)

function errorFunction(e) {
    console.log("hata")
}

//? Haritaya tıklanınca çalışır
function onMapClick(e) {
    //* Haritaya tıklanıldığında form bileşeninin display özelliğini flex yaptık
    form.style.display = "flex"
    console.log(e)
    //* Haritada tıkladığımız yerin kordinatlarını coords dizisi içerisine aktardık
    coords = [e.latlng.lat, e.latlng.lng]
    console.log(coords)
}

//? Kullanıcının konumuna göre haritayı ekrana aktarır
function loadMap(e) {

    //* 1-- Haritanın kurulumu
    map = L.map("map").setView([e.coords.latitude, e.coords.longitude], 13)
    L.control

    //* 2-- Haritanın nasıl gözükeceğini belirler
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    //* 3-- Haritada ekrana basacağımız imleçleri tutan katman
    layerGroup = L.layerGroup().addTo(map)

    //* Local den gelen notları isteme
    renderNoteList(notes)

    //? Haritada bir tıklanma olduğunda çalışacak fonksiyon
    map.on('click', onMapClick)
}

function renderMarker(item) {
    // L.marker([50.505, 30.57], { icon: myIcon }).addTo(map)
    L.marker(item.coords, { icon: detectIcon(item.status) }).addTo(layerGroup).bindPopup(`${item.desc}`)
}

function handleSubmit(e) {
    e.preventDefault() // Sayfanın yenilenmesini engeller
    console.log(e)
    //* Formun içerisindeki değerleri alma
    const desc = e.target[0].value
    const date = e.target[1].value
    const status = e.target[2].value

    notes.push({
        id: uuidv4(),
        desc,
        date,
        status,
        coords,
    })

    //* Local storage güncelle
    setStorage(notes)

    //* renderNoteList fonksiyonuna parametre olarak notes dizisini gönderdik
    renderNoteList(notes)

    //* Form gönderildiğinde kapat
    form.style.display = "none"
}

//? Ekrana notları aktaracak fonksiyon
function renderNoteList(item) {

    //* Notlar(list) alanını temizler
    list.innerHTML = ""
    //* Marker ları temizler
    layerGroup.clearLayers()

    //* Her bir not için li etiketi oluşturur ve içerisini günceller
    item.forEach((item) => {
        const listElement = document.createElement("li") // Bir li elementi oluşturur
        listElement.dataset.id = item.id // li etiketine data-id özelliği ekler
        listElement.innerHTML = `
        <div>
                        <p>${item.desc}</p>
                        <p><span>Date:</span> ${item.date}</p>
                        <p><span>Status:</span> ${item.status}</p>
                    </div>
                    <i class="bi bi-x" id="delate"></i>
                    <i class="bi bi-airplane-fill" id="fly"></i>
        `

        list.insertAdjacentElement("afterbegin", listElement)

        renderMarker(item)
    })
}

//? Notes alanında tıklanma olayını izler
function handleClick(e) {

    //* Güncellenecek elemanın id sini öğrenmek için parentElement yöntemini kullandık
    const id = e.target.parentElement.dataset.id
    if (e.target.id === "delate") {

        //* id sını bildiğimiz elemanı dizinin filter yöntemini kullanarak kaldırdık
        notes = notes.filter((note) => note.id != id)
        console.log(notes)
        setStorage(notes) // localStorege ı günceller
        renderNoteList(notes) // Ekranı günceller
    }

    if (e.target.id === "fly") {
        //* Tıkladığımız elemanın id si ile dizi içerisindeki elemanlardan herhangi birinin id si eşleşirse bulur
        const note = notes.find((note) => note.id == id)
        console.log(note)
        map.flyTo(note.coords) // Haritayı bulduğumuz elemana yönlendirmesi için flyTo yöntemini kullandık
    }
}