//? Tipi analiz edip ona göre fonksiyonun çağrıldığı yere
//? tipe denk gelen açıklamayı gönderir.
export const detecType = (type) => {
    switch (type) {
        case "important":
            return "Important";
        case "home":
            return "Home";
        case "work":
            return "Work";
        case "visit":
            return "Visit";
    }
};

//? localStorage ı güncelleyecek fonksiyon
export const setStorage = (data) => {

    //* Veriyi local e göndermek için string e çevirme
    const strData = JSON.stringify(data)

    //* localStorage a veriyi gönderdik
    localStorage.setItem("notes", strData)
}



var carIcon = L.icon({
    iconUrl: 'car.png',
    iconSize: [50, 60],
})

var homeIcon = L.icon({
    iconUrl: 'home-marker.png',
    iconSize: [50, 60],
})

var jobIcon = L.icon({
    iconUrl: 'job.png',
    iconSize: [50, 60],
})

var visitIcon = L.icon({
    iconUrl: 'visit.png',
    iconSize: [50, 60],
})

export const detectIcon = (type) => {
    switch (type) {
        case "important":
            return carIcon
        case "home":
            return homeIcon
        case "work":
            return jobIcon
        case "visit":
            return visitIcon

    }
}