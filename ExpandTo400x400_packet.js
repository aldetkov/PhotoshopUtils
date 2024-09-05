#target photoshop

// Функция для обрезки прозрачных краев
function trimTransparent() {
    var idtrim = stringIDToTypeID("trim");
    var desc = new ActionDescriptor();
    var idtrimBasedOn = stringIDToTypeID("trimBasedOn");
    var idtransparency = stringIDToTypeID("transparency");
    desc.putEnumerated(idtrimBasedOn, idtrimBasedOn, idtransparency);
    var idtop = stringIDToTypeID("top");
    desc.putBoolean(idtop, true);
    var idbottom = stringIDToTypeID("bottom");
    desc.putBoolean(idbottom, true);
    var idleft = stringIDToTypeID("left");
    desc.putBoolean(idleft, true);
    var idright = stringIDToTypeID("right");
    desc.putBoolean(idright, true);
    executeAction(idtrim, desc, DialogModes.NO);
}

// Функция для изменения размера изображения с высотой 400 пикселей
function resizeImageHeightTo400() {
    var doc = app.activeDocument;
    var targetHeight = 400; // Целевая высота

    // Изменяем размер изображения, устанавливая высоту в 400 пикселей (пропорционально)
    doc.resizeImage(undefined, UnitValue(targetHeight, "px"), undefined, ResampleMethod.BICUBIC);
}

// Функция для изменения размера холста до 400x400 пикселей
function resizeCanvasTo400x400() {
    var newWidth = 400;
    var newHeight = 400;
    var doc = app.activeDocument;

    // Если ширина изображения меньше 400, добавляем пустые поля
    if (doc.width < newWidth) {
        doc.resizeCanvas(newWidth, doc.height, AnchorPosition.MIDDLECENTER);
    }

    // Если изображение больше по ширине, уменьшаем его до 400
    else if (doc.width > newWidth) {
        doc.resizeImage(UnitValue(newWidth, "px"), undefined, undefined, ResampleMethod.BICUBIC);
    }

    // Изменяем размер холста до 400x400
    doc.resizeCanvas(newWidth, newHeight, AnchorPosition.MIDDLECENTER);
}

// Основной процесс обработки изображений в папке
function processFolder(folderPath) {
    var folder = new Folder(folderPath);
    var files = folder.getFiles(/\.(jpg|jpeg|png|tif|tiff)$/i); // Фильтрация изображений

    // Отключение всех диалогов (включая цветовые профили)
    var originalDialogMode = app.displayDialogs;
    app.displayDialogs = DialogModes.NO;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // Открытие файла
        var doc = open(file);

        resizeImageHeightTo400();
        resizeCanvasTo400x400();

        // Сохранение изменений в исходном формате (аналог Ctrl+S)
        doc.save();

        // Закрытие документа без сохранения (исходного)
        doc.close(SaveOptions.DONOTSAVECHANGES);
    }

    // Восстановление настроек цветового профиля
    app.colorSettings = originalColorSettings;

    alert("Обработка завершена!");
}

// Запрос пути к папке у пользователя
function main() {
    var folderPath = Folder.selectDialog("Выберите папку с изображениями для обработки:");

    if (folderPath) {
        processFolder(folderPath);
    } else {
        alert("Папка не выбрана. Скрипт завершен.");
    }
}

// Запуск основного процесса
main();