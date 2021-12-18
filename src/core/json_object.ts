import { languages, translatedObject } from '..';
import { plaintranslate } from './core';

export async function objectTranslator(
  object: translatedObject,
  from: languages,
  to: languages | languages[]
): Promise<translatedObject> {
  if (object && from && to) {
    if (typeof to == 'object') {
      let general_object: { [key: string]: translatedObject } = {};

      await Promise.all(
        Object.keys(to as languages[]).map(async function(index) {
          const index_as_num = Number(index);
          const copy_object = JSON.parse(JSON.stringify(object));

          general_object[to[index_as_num]] = await deepDiver(
            copy_object,
            from,
            to[index_as_num]
          );
        })
      );

      return general_object;
    } else {
      await deepDiver(object, from, to);

      return object;
    }
  } else {
    throw new Error(
      `Undefined values detected. Available ones: object: ${!!object}, from: ${!!from}, to: ${!!to}`
    );
  }
}

async function deepDiver(
  object: translatedObject,
  from: languages,
  to: languages
) {
  var has = Object.prototype.hasOwnProperty.bind(object);

  await Promise.all(
    Object.keys(object).map(async function(k) {
      if (has(k)) {
        switch (typeof object[k]) {
          case 'object':
            await deepDiver(object[k], from, to);
            break;
          case 'string':
            object[k] = await plaintranslate(object[k], from, to);
        }
      }
    })
  );

  return object;
}