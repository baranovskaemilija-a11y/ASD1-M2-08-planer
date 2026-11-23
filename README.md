# Planer przygotowań do sesji

Autor: Emilija Baranovska  
Kod tematu: ASD1-M2-08  
Przedmiot: Algorytmy i struktury danych I  
Rok akademicki: 2026/2027

## Cel projektu

Aplikacja pomaga organizować naukę, kontrolować terminy
i obliczać pozostały czas przygotowań do sesji.

## Funkcje

- Dodawanie zadań z terminem, priorytetem i planowanym czasem.
- Porządkowanie zadań według terminu, następnie wyższego
  priorytetu, a przy remisie — niższego ID.
- Wprowadzanie wykonanych minut nauki.
- Obliczanie pozostałego czasu dla każdego zadania i łącznie.
- Oznaczanie zadań zaległych względem wybranej daty.
- Przenoszenie zadań do listy ukończonych i przywracanie ich.

## Uruchomienie aplikacji

1. Kliknij „Code” i wybierz „Download ZIP”.
2. Rozpakuj pobrany folder.
3. Otwórz „index.html” w przeglądarce.

Pliki index.html, script.js i logo.png powinny znajdować się
w tym samym folderze. Aplikacja działa lokalnie.

## Pliki projektu

- index.html — struktura strony oraz style CSS.
- script.js — działanie aplikacji i obliczenia.
- logo.png — logo uczelni.

## Struktury danych

- Tablica — przechowuje zadania.
- Obiekty — przechowują właściwości poszczególnych zadań.
- WeakMap — łączy elementy listy na stronie z obiektami zadań.

## Obliczanie czasu

Pozostały czas = maksimum z 0 oraz różnicy:
planowane minuty − wykonane minuty.

Dla zadania oznaczonego jako ukończone pozostały czas wynosi 0.

## Ograniczenia

Zadania są przechowywane w pamięci podczas działania strony.
Odświeżenie lub zamknięcie strony powoduje utratę danych.

## Wykorzystanie AI

Korzystano z pomocy ChatGPT przy tworzeniu i wyjaśnianiu kodu
oraz przygotowaniu materiałów do projektu.
