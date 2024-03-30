function dataSourcesClickHandling() {
  window.Wized = window.Wized || [];
  window.Wized.push((Wized) => {
    const dataSourceItems = document.querySelectorAll(
      "[w-el='datasource-list-item']"
    );

    dataSourceItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        // data logic

        const dataValue = event.currentTarget.getAttribute("datasource_id");
        const dataType = event.currentTarget.getAttribute("data_type");

        Wized.data.v.active_datasource = dataValue;
        Wized.data.v.active_datasource_type = dataType;
        Wized.requests.execute("get_datasource");

        // Element visibility
        const editDatasourcesForms = document.querySelectorAll(
          ".edit-datasource-form"
        );
        const pdfForm = document.querySelector(
          "[w-el='form-container-edit-pdf']"
        );
        const csvForm = document.querySelector(
          "[w-el='form-container-edit-csv']"
        );
        const urlForm = document.querySelector(
          "[w-el='form-container-edit-url']"
        );
        const apiForm = document.querySelector(
          "[w-el='form-container-edit-api']"
        );

        editDatasourcesForms.forEach((form) => {
          form.style.display = "none";
        });

        if (v.active_datasource_type === "pdf") {
          pdfForm.style.display = "flex";
        } else if (v.active_datasource_type === "csv") {
          csvForm.style.display = "flex";
        } else if (v.active_datasource_type === "url") {
          urlForm.style.display = "flex";
        } else if (v.active_datasource_type === "api") {
          apiForm.style.display = "flex";
        }

        const datasourcesContainer = document.querySelector(
          '[w-el="datasources-list-container"]'
        );
        const editDatasourcesContainer = document.querySelector(
          '[w-el="edit-datasources-container"]'
        );

        datasourcesContainer.style.display = "none";
        editDatasourcesContainer.style.display = "flex";

        const scrollBox = document.querySelector("[content-scrollbox]");
        if (scrollBox) {
          scrollBox.scrollTop = 0;
        }
      });
    });
  });
}

dataSourcesClickHandling();
