const headers = {
  'Content-Type': 'application/json',
};

export const createClient = (Client) => {
  const { name, email, phone, providers } = Client;
  return {
    options: {
      method: 'post',
      url: process.env.VUE_APP_CREATE_CLIENT,
      headers,
      data: {
        name,
        email,
        phone,
        providers,
      },
    },
    success: {
      type: 'success',
      title: 'Client ADDED',
      text: 'Client was successfully added',
      duration: 3000,
      speed: 200,
    },
    alreadyExist: {
      type: 'warn',
      title: 'CLIENT EXIST',
      text: 'Client with such email or phone already exist',
      duration: 3000,
      speed: 200,
    },
  };
};

export const readClients = (limit, page) => ({
  options: {
    method: 'get',
    url: process.env.VUE_APP_READ_CLIENTS,
    headers,
    params: { limit, page },
  },
});

export const deleteClient = (id) => ({
  options: {
    method: 'delete',
    url: process.env.VUE_APP_DELETE_CLIENT,
    headers,
    params: { _id: id },
  },
  success: {
    type: 'success',
    title: 'CLIENT DELETED',
    text: 'Client was successfully deleted',
  },
});

export const updateClient = (Client) => {
  const { name, email, phone, providers, _id } = Client;
  return {
    options: {
      method: 'put',
      url: process.env.VUE_APP_UPDATE_CLIENT,
      headers,
      data: {
        name,
        email,
        phone,
        providers,
      },
      params: { _id },
    },
    success: {
      type: 'success',
      title: 'CLIENT SAVED',
      text: 'Client was successfully edited',
      duration: 3000,
      speed: 200,
    },
    alreadyExist: {
      type: 'warn',
      title: 'CLIENT ALREADY EXIST',
      text: 'Client with such email or phone already exist, settings were not saved',
      duration: 3000,
      speed: 200,
    },
  };
};
