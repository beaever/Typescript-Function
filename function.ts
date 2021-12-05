export const qs = (_: string): Element | null => {
  return document.querySelector(_) ?? null;
};

export const click = (selector: string): void => {
  if (document.querySelector(selector) === null) return;
  qs(selector)!.dispatchEvent(
    new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      buttons: 1,
    })
  );
};

// n 시간 데이터 ms 단위 데이터로 반환
export const getHour = (e: number): number => {
  return 1000 * 60 * 60 * e;
};

export const phoneFormat = (_x: string): string => {
  var number = _x.replace(/-/gi, '');
  var tel = '';

  if (number.replace(/[ 0-9 | \- ]/g, '').length) {
    number = number.substr(0, number.length - 1);
  }

  if (number.length < 4) {
    return number;
  } else if (number.length < 7) {
    tel += number.substr(0, 3);
    tel += '-';
    tel += number.substr(3);
  } else if (number.length < 11) {
    tel += number.substr(0, 3);
    tel += '-';
    tel += number.substr(3, 3);
    tel += '-';
    tel += number.substr(6);
  } else {
    tel += number.substr(0, 3);
    tel += '-';
    tel += number.substr(3, 4);
    tel += '-';
    tel += number.substr(7);
  }

  return tel;
};

export const brithFormat = (b: string): string => {
  let birth = b.replace(/\s/gi, '');
  let formatBirth = '';
  // if (birth.length <= 6) {
  //   formatBirth = birth.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
  // } else {
  formatBirth = birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  // }
  return formatBirth;
};

export const getQuery = (any?: any) => {
  let query_string = window.location.search;
  query_string = query_string.replace('?', '');
  const query_string_arr = query_string.split('&');
  const query = {} as { [attr: string]: string | number };
  for (let i = 0; i < query_string_arr.length; i++) {
    const key_value_str = query_string_arr[i];
    const key_value_arr = key_value_str.split('=');
    if (key_value_arr.length === 2) {
      query[key_value_arr[0]] = key_value_arr[1] ? key_value_arr[1] : '';
    }
  }

  return query;
};

export const queryToString = (query: { [attr: string]: string | number }) => {
  const attrs = Object.keys(query);
  let tmp = '';
  for (let i = 0; i < attrs.length; i++) {
    if (i === 0) {
      tmp += '?';
    }

    tmp += attrs[i];
    tmp += '=';
    tmp += query[attrs[i]];

    if (i !== attrs.length - 1) {
      tmp += '&';
    }
  }
  return tmp;
};

export const resizeBase64 = (base64: string) => {
  return new Promise((resolve, reject) => {
    const MAX_WIDTH = 1024;
    const MAX_HEIGHT = 1024;

    const canvas_origin = document.createElement('canvas');
    const canvas_resize = document.createElement('canvas');
    const canvas_origin_context = canvas_origin.getContext('2d');
    const canvas_resize_context = canvas_resize.getContext('2d');

    const img = new Image();

    img.onload = function () {
      let ratio = 1;

      const is_vertical_picture = img.height > img.width;

      if (is_vertical_picture && img.height > MAX_HEIGHT) {
        ratio = MAX_HEIGHT / img.height;
      }

      if (!is_vertical_picture && img.width > MAX_WIDTH) {
        ratio = MAX_WIDTH / img.width;
      }

      canvas_origin.width = img.width;
      canvas_origin.height = img.height;
      canvas_origin_context.drawImage(img, 0, 0);

      canvas_resize.width = img.width * ratio;
      canvas_resize.height = img.height * ratio;

      canvas_resize_context.drawImage(
        canvas_origin,
        0,
        0,
        canvas_origin.width,
        canvas_origin.height,
        0,
        0,
        canvas_resize.width,
        canvas_resize.height
      );

      resolve(canvas_resize.toDataURL());
    };

    img.src = base64;
  });
};

export const rotateBase64 = (
  base64: string,
  degree: number
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    while (degree < 0) {
      degree += 360;
    }

    if (degree % 90 !== 0) reject('degree단위는 90도만 가능합니다.');

    const count = degree / 90;

    let src = base64;

    for (let i = 0; i < count; i++) {
      src = await rorateImage(src);
    }

    resolve(src);
  });
};

function rorateImage(base64: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      document.body.appendChild(canvas);

      const width = image.height;
      const height = image.width;

      context.save();
      canvas.width = width;
      canvas.height = height;
      context.translate(width / 2, height / 2);
      context.rotate(Math.PI / 2);

      context.drawImage(image, -(height / 2), -(width / 2));
      context.restore();
      console.log(width, height);
      resolve(canvas.toDataURL());
      document.body.removeChild(canvas);
    };

    image.src = base64;
  });
}

export const base64ToFile = (base64: string, fileName: string) => {
  if (base64 !== undefined) {
    let arr = base64.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }
};

//-------------------------------------------------------------------------------

// 실수 여부 반환
export const isFloat = (e: number): boolean => {
  if (!e) return false;
  return e.toString().indexOf('.') !== -1;
};
// 소수점 찍어주기
export const toFix = (_e: number | string, fix: number = 0): string => {
  if (!_e) return '0';
  const e = parseFloat(_e.toString());
  return isFloat(e) ? e.toFixed(fix) : e.toString();
};

// 1,000 -> 1K , 1,000,000 -> 1M , 1,000,000,000 -> 1B
export const mobileFormat = (target: string | number): string => {
  try {
    const _e = parseInt(target.toString());

    const is_negative = _e < 0 ? '-' : '';

    const e = Math.abs(_e);

    const end_string =
      e >= 1000000000 ? 'B' : e >= 1000000 ? 'M' : e >= 1000 ? 'K' : '';

    const value =
      e >= 1000000000
        ? e / 1000000000
        : e >= 1000000
        ? e / 1000000
        : e >= 1000
        ? e / 1000
        : e;

    return `${is_negative}${toFix(value)}${end_string}`;
  } catch {
    return '0';
  }
};
