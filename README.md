# ItransitionTask5

<https://itransition-task-5-ifow.onrender.com>

Web-application for the fake (random) user data generation.

The single app page allows to:

1) select region (at least 3 different, e.g. Poland, USA, Georgia or anything you prefer)
2) specify the number of error per record (slider 0..10 + binded number field with max value limit at least 1000)
3) define seed value and [Random] button to generate a random seed

If the user change anything, the table below (20 records are generated again).

It's necessary to support infinite scrolling in the table (you show 20 records and if the user scroll down, you add next 10 records below — add new so called "page" = "batch of records").

The table show contain the following fields:

1) Index (1, 2, 3, ...)
2) Random identifier
3) Name + middle name + last name (in region format)
4) Address (in several possible formats, e.g. city+street+building+appartment or county+city+street+house)
5) Phone (again, it's great to have several formats, e.g. international or local ones)

Language of the names/address as well as phone codes/zip codes should be correleted to region. You need to generate random data that looks somehow realistically. So, in Poland — Polish, in USA - English or Spanish, etc.
What is error? It's data entry error emulation. The end user specify number of errors PER RECORD. If errors = 0, there are no errors in user data. If error = 0.5, every record contains an error with probability 0.5 (one error per two recods). 10 errors results in 10 errors in every record. Error number can be entered with a slider (0..10) or field  (0..1000) — they interconnected, if change one control, other is changed too.

Support 3 type of errors - delete character in random position, add random character (from a proper alphabet) in random position, swap near characters. Type of the error have to be chosen ramdomly with equal probabilities (when user specifies 1000 errors, "noisy user data" should not be too long or too short).

About seed.

Of course, you do not store RANDOM data on the server. When the user change seed, you have to change generated data. It's important that the seed passed to RNG algorithm is combination of the user seed and page number (so, you do not re-generate pages 1..9 when the user requests page 10). How to combine - it's not really important, some kind of sum should be enough. IMPORTANT: if I enter the same seed tomorrow I have to get the same data as today (even errors) on all pages - it's especially important for optional requirement.

Of course, you will need to user lookup tables with names and surnames (separately, to be able to combine) as well as cities, etc.. They have to be large enough (more than 2 names and 10 surnames), let's say hundreds of names and several thousands of surnames. Your goal - approximately — avoid full user data duplication in ~10_000_000 records.

If user changes error amount, data (names, addresses, etc.) before error application should not be changed. If I make 1 error in John, I can get Jhon, not Simth.

And again: data should look like realistic.

Application should work WITHOUT registration or/and authentication.
Optional requirement:
Add Export to CSV button (generate the number of pages which is displayed to user currently). You have to use ready CSV-formatter (DO NOT concatenate string by hands — e.g. address easily can contain comma and semicolon of anything).

Of course, errors should be "applied" before formatting/rendering/exporting.

--------------------------------------------------------------------------

Web-приложение для генерации фейковых пользовательских данных (случайных).

На единственной странице над данными можно выбрать регион (требуется поддержка как минимум 3, например, США+английский, Польша+польский, Узбекистан+узбекский или что угодно), можно выбрать количество ошибок на одну запись (слайдером от 0 до 10 и связанным полем ввода, которое позволяет ввести числа до 1000) и seed (полем ввода со связанной кнопкой Random).

При изменении хотя бы одного из параметров таблица внизу (20 записей) перегенерируется заново.
Таблица должна поддерживать бесконечный скроллинг (изначально 20 записей, если скролбар "дернуть вниз", то догружается ещё 10 записей — т.н. «страница»).

Таблица выглядит следующим образом:

1) Номер
2) Случайный идентификатор
3) ФИО
4) Адрес (в нескольких вариантах форматов, не под копирку, например, где-то это область, город, улица, дом, корпус, квартира, а где-то село, улица и дом)
5) Телефон (опять же, желательно в нескольких вариантах форматов)

Язык имени и адреса, номера телефонов, диапазоны индексов должны соответствовать региону (данные должны выглядеть реалистично!). В РБ — бел., в Украине — украинский, в США — английский и т.п.

Что такое "ошибка"? Это эмуляция неправильного ввода данных пользователями. Измеряется в числе ошибок НА ОДНУ ЗАПИСЬ. Если ошибок 0, то данные "стерильны". Если ошибок 0.5, до запись содержит ошибку с вероятностью 0.5. Если ошибок 2, то каждая запись содержит 2 ошибки (если 10.5 ошибок — то 10 ошибок и еще одна с вероятностью 0.5). Значение числа ошибок можно изменять или слайдером (от 0 до 10 с шагом, например, 0.25), или вводить в поле (от 0 до 1000, поддержка нецелых значений) — при изменении одного контрола синхронно изменяется другой. 

Нужно поддерживать 3 вида ошибок — удаление одного символа в случайной позиции, добавление одного случайного символа в случайной позиции (из алфавита соотв. региона или цифр), перестановка двух соседних символов местами. Вид ошибки выбирается случайно с равной вероятностью (при большом числе ошибок данные не должны сильно увеличиваться по длине или сжиматься до пустых строк).

Теперь про seed.
Конечно, сгенерированные случайные данные на сервере хранить не только неправильно, но и просто НЕЛЬЗЯ.
Очевидно, изменение seed меняет данные (они генерируются рандомом). Важно сделать так, чтобы то значение сида, которое вы будете передавать в рандом, являлось комбинацией сида, указанного пользователем, и номера подгружаемой страницы (например, чтобы при генерации страницы 10 на сервере не было необходимости генерировать все промежуточные данные на страницах от 1-2 до 9). Как вы будете комбинировать — дело ваше, в общем, простая сумма сойдёт. ВАЖНО: если я завтра введу такой же сид, что и вчера, данные, включая ошибки, должны совпасть с теми, что были вчера, не только на первых страницах, но и на всех последующих (особенно важно для реализации требования со звездочкой).

Вам, конечно, потребуются базы ("справочники") с именами и фамилиями (отдельно, чтобы комбинировать), городами и проч. Они должны быть достаточно большие, например, не 2-10 имен и 20 фамилий, а сотни имён и многие тысячи фамилий. Ориентируйтесь — примерно — чтобы у вас повторение ожидалось не раньше ~10_000_000 записей.

При изменении числа ошибок данные не должны менятьcя (фамилии, адреса и проч. до применения ошибок должны оставаться такими же). Если я делаю 1 ошибку в фамилии Иванов, я могу получить Иавнов, но никак не Череззаброоногузадерищенко.

ПРИЛОЖЕНИЕ ОБЯЗАНО ПОЗВОЛЯТЬ РАБОТАТЬ СРАЗУ, БЕЗ РЕГИСТРАЦИИ И/ИЛИ АУТЕНТИФИКАЦИИ.

Требование со звездочкой: добавить кнопку Export to CSV, по нажатию на которую сервер должен сгенерировать и отдать CSV-файл со всеми данными, которые сейчас видит пользователь — сколько отскроллил, столько и получил. Требование: использовать готовый форматер для CSV, ни в коем случае не клеить строчки руками (например, адрес может содержать разделитель CSV).
