const formularz = document.getElementById("formularz-zadania"); // Pobiera formularz z HTML.
const lista = document.getElementById("lista-zadan"); // Pobiera listę aktywnych zadań.
const listaUkonczonych = document.getElementById("lista-ukonczonych"); // Pobiera listę ukończonych zadań.
const dataOdniesienia = document.getElementById("data-odniesienia"); // Pobiera pole daty odniesienia.
const sumaMinut = document.getElementById("suma-minut"); // Pobiera miejsce na sumę minut.

const zadania = []; // Tworzy pustą tablicę wszystkich zadań.
const zadaniaWedlugWiersza = new WeakMap(); // Łączy elementy HTML z obiektami zadań.

function obliczPozostaleMinuty(zadanie) { // Oblicza pozostały czas jednego zadania.
    if (zadanie.zakonczone) { // Sprawdza, czy zadanie jest ukończone.
        return 0; // Dla ukończonego zadania zwraca zero minut.
    }

    return Math.max(0, zadanie.planowaneMinuty - zadanie.wykonaneMinuty); // Odejmuje wykonany czas, bez wyniku ujemnego.
}

function aktualizujSumeMinut() { // Aktualizuje łączny pozostały czas.
    let suma = 0; // Zaczyna liczenie od zera.

    for (const zadanie of zadania) { // Przechodzi przez wszystkie zadania.
        suma += obliczPozostaleMinuty(zadanie); // Dodaje pozostałe minuty danego zadania.
    }

    sumaMinut.textContent = `Łącznie zostało: ${suma} min`; // Wyświetla sumę na stronie.
}

function wstawDoListy(pozycja, zadanie) { // Wstawia zadanie we właściwym miejscu listy.
    for (const wiersz of lista.children) { // Przegląda elementy aktywnej listy.
        const inneZadanie = zadaniaWedlugWiersza.get(wiersz); // Pobiera zadanie powiązane z elementem HTML.

        const kolejnosc = // Oblicza, które zadanie powinno znaleźć się wcześniej.
            zadanie.termin.localeCompare(inneZadanie.termin) || // Najpierw porównuje terminy.
            inneZadanie.priorytet - zadanie.priorytet || // Przy równych terminach wybiera większy priorytet.
            zadanie.id - inneZadanie.id; // Przy dalszym remisie wybiera mniejsze ID.

        if (kolejnosc < 0) { // Jeśli nowe zadanie powinno być wcześniej.
            lista.insertBefore(pozycja, wiersz); // Wstawia je przed aktualnie sprawdzanym elementem.
            return; // Kończy funkcję po wstawieniu.
        }
    }

    lista.appendChild(pozycja); // Jeśli nie znalazło wcześniejszego miejsca, dodaje na końcu.
}

formularz.addEventListener("submit", function (zdarzenie) { // Reaguje na wysłanie formularza.
    zdarzenie.preventDefault(); // Zapobiega domyślnemu przeładowaniu strony.

    const przedmiot = document.getElementById("przedmiot").value.trim(); // Pobiera przedmiot i usuwa skrajne spacje.
    const tytul = document.getElementById("tytul").value.trim(); // Pobiera tytuł i usuwa skrajne spacje.

    if (przedmiot === "" || tytul === "") { // Sprawdza, czy któreś pole jest puste.
        alert("Wpisz przedmiot i tytuł zadania."); // Pokazuje komunikat o błędzie.
        return; // Przerywa dodawanie zadania.
    }

    const zadanie = { // Tworzy obiekt opisujący zadanie.
        id: zadania.length + 1, // Nadaje kolejny numer.
        przedmiot: przedmiot, // Zapisuje nazwę przedmiotu.
        tytul: tytul, // Zapisuje tytuł zadania.
        termin: document.getElementById("termin").value, // Pobiera termin.
        priorytet: Number(document.getElementById("priorytet").value), // Pobiera priorytet jako liczbę.
        planowaneMinuty: document.getElementById("planowane-minuty").valueAsNumber, // Pobiera planowany czas jako liczbę.
        wykonaneMinuty: 0, // Początkowo wykonano zero minut.
        zakonczone: false // Początkowo zadanie nie jest ukończone.
    };

    zadania.push(zadanie); // Dodaje zadanie do tablicy.

    const pozycja = document.createElement("li"); // Tworzy element listy HTML.
    zadaniaWedlugWiersza.set(pozycja, zadanie); // Łączy element listy z danymi zadania.

    const opis = document.createElement("span"); // Tworzy miejsce na opis zadania.

    function aktualizujOpis() { // Odświeża opis tego zadania.
        const pozostalo = obliczPozostaleMinuty(zadanie); // Oblicza pozostałe minuty.
        const zalegle = !zadanie.zakonczone && // Zadanie musi być nieukończone.
            dataOdniesienia.value !== "" && // Data odniesienia musi być wybrana.
            zadanie.termin < dataOdniesienia.value; // Termin musi być wcześniejszy od daty odniesienia.

        opis.textContent = // Ustawia tekst opisu.
            `${zadanie.przedmiot} – ${zadanie.tytul} | termin: ${zadanie.termin} | ` + // Dodaje przedmiot, tytuł i termin.
            `priorytet: ${zadanie.priorytet} | zostało: ${pozostalo} min. ` + // Dodaje priorytet i pozostały czas.
            (zalegle ? "⚠ ZALEGŁE. " : ""); // Dodaje ostrzeżenie tylko dla zaległego zadania.
    }

    dataOdniesienia.addEventListener("change", aktualizujOpis); // Odświeża opis po zmianie daty.

    const etykieta = document.createElement("label"); // Tworzy podpis pola minut.
    etykieta.textContent = "Wykonane minuty: "; // Ustawia treść podpisu.

    const poleMinut = document.createElement("input"); // Tworzy pole do wpisywania minut.
    poleMinut.type = "number"; // Ustawia pole liczbowe.
    poleMinut.min = "0"; // Nie dopuszcza wartości mniejszych od zera.
    poleMinut.step = "1"; // Ustawia krok wartości na jedną minutę.
    poleMinut.required = true; // Pole nie może być puste.
    poleMinut.value = zadanie.wykonaneMinuty; // Wyświetla zapisany wykonany czas.

    poleMinut.addEventListener("change", function () { // Reaguje na zatwierdzoną zmianę minut.
        if (!poleMinut.reportValidity()) { // Sprawdza, czy wpisana wartość jest nieprawidłowa.
            poleMinut.value = zadanie.wykonaneMinuty; // Przywraca poprzednią wartość.
            return; // Przerywa obsługę błędnej zmiany.
        }

        zadanie.wykonaneMinuty = poleMinut.valueAsNumber; // Zapisuje nową liczbę minut.
        aktualizujOpis(); // Aktualizuje opis zadania.
        aktualizujSumeMinut(); // Aktualizuje łączny pozostały czas.
    });

    etykieta.appendChild(poleMinut); // Umieszcza pole minut w jego podpisie.

    const poleUkonczone = document.createElement("input"); // Tworzy pole oznaczania ukończenia.
    poleUkonczone.type = "checkbox"; // Ustawia typ pola do zaznaczania.

    const etykietaUkonczone = document.createElement("label"); // Tworzy podpis checkboxa.
    etykietaUkonczone.append(" Ukończone ", poleUkonczone); // Dodaje tekst i checkbox do podpisu.

    poleUkonczone.addEventListener("change", function () { // Reaguje na zmianę zaznaczenia.
        zadanie.zakonczone = poleUkonczone.checked; // Zapisuje, czy zadanie jest ukończone.

        if (zadanie.zakonczone) { // Jeśli zadanie ukończono.
            listaUkonczonych.appendChild(pozycja); // Przenosi je do listy ukończonych.
        } else { // Jeśli cofnięto ukończenie.
            wstawDoListy(pozycja, zadanie); // Przywraca je na aktywną listę we właściwej kolejności.
        }

        aktualizujOpis(); // Odświeża opis zadania.
        aktualizujSumeMinut(); // Przelicza sumę pozostałych minut.
    });

    pozycja.append(opis, etykieta, etykietaUkonczone); // Umieszcza opis i pola w elemencie listy.
    aktualizujOpis(); // Tworzy początkowy opis.
    wstawDoListy(pozycja, zadanie); // Dodaje element do aktywnej listy.
    aktualizujSumeMinut(); // Aktualizuje sumę po dodaniu zadania.

    formularz.reset(); // Przywraca domyślne wartości formularza.
});