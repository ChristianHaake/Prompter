# Hulp

## Wat doet Prompter?

Prompter is een lokale teleprompter in de browser. Je schrijft of opent een
script, stelt de doelduur en leesbaarheid in en start de presentatiemodus.

## Snel aan de slag

1. Plak tekst in het tekstveld.
2. Stel de doelduur rechtstreeks of met een timerinstelling in, plus de
   tekengrootte, regelafstand, het lettertype, de kleuren, spiegelmodus,
   focuslijn en aftelling.
3. Controleer de tekst met ‘Voorbeeld’ of start ‘Presenteren’.
4. Pauzeer of hervat in de presentatiemodus met de spatiebalk.
5. Pas de snelheid aan met de pijl omhoog en pijl omlaag.
6. Ga met pijl rechts/links of Page Up/Down naar koppen en sectiemarkeringen.
7. Gebruik `R` om opnieuw te beginnen en Escape om terug te keren naar de editor.
   Afgeronde en afgebroken presentaties verschijnen in de presentatiegeschiedenis.

## Voorbeeld en opmaak

Het voorbeeld gebruikt dezelfde weergave als de presentatiemodus en kan worden
afgespeeld, maar heeft geen aftelling en slaat niets op in de
presentatiegeschiedenis. Wijzigingen in tekengrootte, regelafstand, spiegelmodus
en focuslijn zijn meteen zichtbaar.

De editor ondersteunt Markdown in scripts. Koppen, **vetgedrukte** en
*cursieve* tekst worden in het voorbeeld en de presentatie weergegeven.
Horizontale lijnen (`---`) kunnen als sectiemarkeringen dienen.

## Toetsenbordbediening

- `Tab`: bereik bedieningselementen in de editor en presentatie.
- `Space`: start, pauzeer of hervat de presentatie.
- `Pijl omhoog` / `Pijl omlaag`: wijzig de snelheid.
- `Pijl links` / `Pijl rechts` of `Page Up` / `Page Down`: wissel tussen secties.
- `R`: stel de presentatie opnieuw in.
- `Escape`: sluit het voorbeeld of de presentatie.

## Projecten opslaan en openen

Het huidige concept wordt automatisch in de browser opgeslagen. Deze opslag is
alleen bedoeld als herstelmogelijkheid in dezelfde browser.

Sla voor een blijvende reservekopie een `.prompter`-bestand op met ‘Project
opslaan’. Je kunt het later weer laden met ‘Project openen’. Bij het openen wordt
het huidige concept vervangen; de app vraagt dit eerst te bevestigen.

Je kunt ook `.txt`- en `.md`-bestanden rechtstreeks als scripttekst importeren.
Deze bestanden worden niet als volledige projecten behandeld.

Ongeldige bestanden, te grote bestanden en niet-ondersteunde projectversies
worden geweigerd. Het huidige concept blijft dan behouden.

## Gegevens verwijderen

‘Nieuw’ verwijdert het opgeslagen concept uit deze browser en herstelt het
voorbeeldproject. De presentatiegeschiedenis heeft een eigen knop om gegevens te
wissen en kan als CSV worden geëxporteerd. Na ‘Nieuw’ en ‘Wissen’ verschijnt een
actie om ongedaan te maken, totdat je verder werkt of het tabblad sluit. Je kunt
de websitegegevens ook verwijderen via de browserinstellingen.

## Ondersteunde apparaten en beperkingen

Prompter is gemaakt voor moderne desktop- en mobiele browsers. De app gebruikt
`localStorage`, de fullscreen-API van de browser, Web Audio voor het eindsignaal,
optioneel Wake Lock tijdens presentaties en een serviceworker voor PWA-
functionaliteit.

Projectbestanden zijn JSON-bestanden met de extensie `.prompter`. De huidige
importlimiet is 500 KB. Zeer lange teksten worden beperkt tot 100.000 tekens.

## Feedback

- [Een fout melden](https://haak3.atlassian.net/jira/software/form/69a50efc-0474-445e-8f01-66eb6b747cc1)
- [Een functie voorstellen](https://haak3.atlassian.net/jira/software/form/50d4fc51-bff4-4e21-b46e-8fd987b90d24)
- Of stuur een e-mail naar [apps@haak3.de](mailto:apps@haak3.de).

Deel geen privé-inhoud uit je scripts.
