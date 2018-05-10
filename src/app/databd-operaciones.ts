// tslint:disable-next-line:class-name
export class DataBD_Operaciones {

    DataBD_Operaciones() {}

    getAcceso(type, usr, key) {

        const formParameters = {
            type: type,
            usr: usr,
            key: key
        };

        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteAdminTerminales/resource/getAcceso',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
            .sendFormParameters(formParameters);

            return resourceRequest.sendFormParameters(formParameters);

    }


    getRegistros() {

        const formParameters = {  };

        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteAdminTerminales/resource/getRegistros',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
            .sendFormParameters(formParameters);

            return resourceRequest.sendFormParameters(formParameters);

    }

    setUpdateCrStatus(terminal_id, sucursal_id , activo) {
        const formParameters = {
            terminal_id: terminal_id,
            sucursal_id: sucursal_id,
            activo: activo
        };

        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteAdminTerminales/resource/setUpdateCrStatus',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
            .sendFormParameters(formParameters);

            return resourceRequest.sendFormParameters(formParameters);
    }

    insertaUserPassLegacy(usrLegacy, passLegacy , idTerminal) {
        const formParameters = {
            usrLegacy: usrLegacy,
            passLegacy: passLegacy,
            idTerminal: idTerminal
        };

        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteAdminTerminales/resource/insertaUserPassLegacy',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest.sendFormParameters(formParameters);

            return resourceRequest.sendFormParameters(formParameters);
    }

    insertaUserPassLegacyMasiva( idTerminal, registros) {
        const formParameters = {
            idTerminal: idTerminal,
            registros: registros
        };

        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteAdminTerminales/resource/insertaUserPassLegacyDataMasiva',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
            .sendFormParameters(formParameters);

            return resourceRequest.sendFormParameters(formParameters);
    }

}
