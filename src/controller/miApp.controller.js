import urlWebServices from './webServices';

export const getPosts = async function () {
  let url = urlWebServices.getPosts;

  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los posts: ' + response.status);
    }

    let data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserPosts = async token => {
  const url = urlWebServices.getUserPosts;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });

    if (!response.ok) {
      throw new Error(
        'Error al obtener los posts del usuario: ' + response.status,
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const getTimeDifference = dateNotification => {
  // Convertir las fechas a objetos Date
  const fechaNotificacion = new Date(dateNotification);
  const fechaActual = new Date();

  // Calcular la diferencia en milisegundos
  const timeDifference = fechaActual - fechaNotificacion;

  // Convertir la diferencia a días
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const weeksDifference = Math.floor(daysDifference / 7);

  // Formatear la hora de la acción
  const hours = fechaNotificacion.getHours().toString().padStart(2, '0'); // Aseguramos 2 dígitos
  const minutes = fechaNotificacion.getMinutes().toString().padStart(2, '0');
  const formattedHour = `${hours}:${minutes} hs`;

  // Retornar el mensaje correspondiente
  if (daysDifference <= 0) {
    return `${formattedHour}`;
  } else if (daysDifference === 1) {
    return 'Yesterday';
  } else if (daysDifference <= 7) {
    return daysDifference + ' days ago';
  } else {
    return weeksDifference + 'weeks ago';
  }
};

export const getPostDetails = async postId => {
  try {
    const baseUrl = urlWebServices.getPostDetails;
    const url = baseUrl.replace(':id', postId);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        'Error al obtener los detalles del post: ' + response.status,
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getNotifications = async token => {
  let url = urlWebServices.getNotifications;

  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });

    if (!response.ok) {
      throw new Error(
        'Error al obtener las notificaciones: ' + response.status,
      );
    }

    let data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTimelinePosts = async token => {
  try {
    const followingResponse = await fetch(urlWebServices.getFollowingPosts, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });

    const followingData = await followingResponse.json();

    return {
      data: followingData.data || [],
    };
  } catch (error) {
    throw error;
  }
};

export const signUp = async userData => {
  let url = urlWebServices.signUp;

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(userData),
    });

    let data = await response.json();

    if (data.status === 400) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};


export const signIn = async userData => {
  let url = urlWebServices.signIn;

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    let data = await response.json();
    if (data.status >= 400) {
      throw data;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendPasswordResetEmail = async email => {
  let url = urlWebServices.passwordReset;

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({email}),
    });

    let data = await response.json();
    if (data.status === 404) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async token => {
  let url = urlWebServices.getProfile;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const publishPost = async (postData, token) => {
  try {
    // La URL de los servicios web
    const url = urlWebServices.postPost;

    // Crear un objeto FormData para enviar los datos y archivos
    const formData = new FormData();

    // Agregar datos de texto del post
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('location', postData.location);
    formData.append('user', postData.user);
    formData.append('userAvatar', postData.userAvatar);

    // Agregar archivos multimedia (imágenes y videos)
    if (Array.isArray(postData.media) && postData.media.length > 0) {
      postData.media.forEach(fileUri => {
        const localUri = fileUri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const fileExtension = match ? match[1].toLowerCase() : '';
        let type = '';

        // Verificar si el archivo es una imagen
        if (['jpg', 'jpeg', 'png', 'gif', 'heif', 'heic', 'webp', 'bmp', 'tiff'].includes(fileExtension)) {
          type = `image/${fileExtension}`;
          // Cambiar 'images' a un nombre de campo único
          formData.append(`images`, {
            uri: localUri,
            name: filename,
            type: type,
          });
        }
        // Verificar si el archivo es un video
        else if (['mp4', 'mov', 'avi', 'mkv', 'mpeg', 'webm', 'flv', 'wmv', '3gp', 'ogg'].includes(fileExtension)) {
          type = `video/${fileExtension}`;
          // Cambiar 'videos' a un nombre de campo único
          formData.append(`videos`, {
            uri: localUri,
            name: filename,
            type: type,
          });
        }
      });
    }

    // Verificar los datos enviados
    for (let i = 0; i < formData._parts.length; i++) {
      const part = formData._parts[i];
    }

    // Realizar la solicitud fetch para enviar los datos al backend
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'x-access-token': token,
      },
      body: formData,
    });

    // Verificar si la respuesta es exitosa
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error en la respuesta: ${response.status} - ${errorText}`,
      );
    } else if (!contentType || !contentType.includes('application/json')) {
      const errorText = await response.text();
      throw new Error(`Respuesta no es JSON: ${errorText}`);
    }

    // Analizar JSON si la respuesta es válida
    const responseData = await response.json();

    // Si la respuesta es exitosa, retornar el resultado
    if (response.ok) {
      return {
        success: true,
        message: 'Post published successfully',
        data: responseData.data,
      };
    } else {
      throw new Error(responseData.message || 'Failed to publish post');
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error connecting to server',
    };
  }
};

export const getAds = async () => {
  let url = urlWebServices.getAds;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los anuncios: ' + response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async token => {
  let url = urlWebServices.getUsers;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-access-token': token,
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los usuarios: ' + response.status);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userData, token) => {
  let url = urlWebServices.updateUserProfile;

  try {
    const formData = new FormData();

    if (userData.avatar) {
      const imageUri = userData.avatar;
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('avatar', {
        uri: imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    if (userData.coverImage) {
      const imageUri = userData.coverImage;
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('coverImage', {
        uri: imageUri,
        name: `cover.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    // Agregar otros campos si existen
    if (userData.nombre) formData.append('nombre', userData.nombre);
    if (userData.bio) formData.append('bio', userData.bio);
    if (userData.genero) formData.append('genero', userData.genero);


    // Agregamos un timeout a la petición fetch
    const timeoutDuration = 15000; // 15 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'x-access-token': token,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Limpiamos el timeout si la petición fue exitosa

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating profile');
      }

      const data = await response.json();
      return data;
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error(
          'La conexión ha excedido el tiempo de espera. Por favor, verifica tu conexión a internet e intenta nuevamente.',
        );
      }
      if (
        fetchError instanceof TypeError &&
        fetchError.message === 'Network request failed'
      ) {
        throw new Error(
          'No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.',
        );
      }
      throw fetchError;
    }
  } catch (error) {

    // Manejo específico de errores comunes
    if (error.message.includes('Network request failed')) {
      throw new Error(
        'Error de conexión: Verifica tu conexión a internet e intenta nuevamente',
      );
    }
    if (error.message.includes('timed out')) {
      throw new Error(
        'La conexión ha excedido el tiempo de espera. Por favor, intenta nuevamente',
      );
    }
    if (error.message.includes('JSON')) {
      throw new Error(
        'Error al procesar la respuesta del servidor. Por favor, intenta nuevamente',
      );
    }

    // Si es un error que ya hemos formateado, lo pasamos tal cual
    if (error.message.includes('Error:')) {
      throw error;
    }

    // Para cualquier otro tipo de error
    throw new Error(`Error inesperado: ${error.message}`);
  }
};

export const handleFollowUser = async function (userId, token, isFollowing) {
  // Construir la URL reemplazando el parámetro dinámico
  const baseUrl = urlWebServices.followUser;
  const url = baseUrl.replace(':id', userId);

  try {
    let response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({
        action: isFollowing ? 'unfollow' : 'follow',
      }),
    });

    let data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Error al seguir/dejar de seguir al usuario',
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const interactWithPost = async (
  postId,
  token,
  action,
  comment = null,
) => {
  const url = urlWebServices.interactWithPost.replace(':id', postId);

  try {
    const body = {action};
    if (comment) {
      body.comment = comment;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error interacting with the post');
    }

    return data; // Datos actualizados del post
  } catch (error) {
    throw error;
  }
};

export const searchUsers = async (query, token) => {
  const url = urlWebServices.searchUsers + `?query=${query}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });

    if (!response.ok) {
      // Si la respuesta no es correcta, tratamos los errores
      if (response.status === 500) {
        // No se imprime ningún mensaje en la consola
        return []; // Devuelve una lista vacía si es error 500
      } else {
        // Para otros errores (por ejemplo 404), lanzamos un error normal
        throw new Error('Error al buscar usuarios: ' + response.status);
      }
    }

    const data = await response.json();

    // Si no se encontraron usuarios, simplemente retorna una lista vacía
    if (data.status === 404 || data.data.length === 0) {
      return []; // Devuelve una lista vacía si no se encontraron usuarios
    }

    return data.data; // Retorna los usuarios encontrados
  } catch (error) {
    return []; // En caso de un error de red o cualquier otro problema, devolvemos una lista vacía
  }
};

export const deleteUserAccount = async token => {
  let url = urlWebServices.deleteAccount;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error deleting account');
    }

    return true; // Si se elimina correctamente
  } catch (error) {
    throw error;
  }
};

export const markPostAsFavorite = async (postId, token) => {
  const url = urlWebServices.addFavoritePost.replace(':id', postId);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error adding to favorites');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getFavoritePosts = async token => {
  const url = urlWebServices.getFavoritePosts;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los posts favoritos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
