# ItransitionTask5

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
