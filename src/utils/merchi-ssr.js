import { merchi as sdk_merchi } from "../../sdk/javascript/merchi";
import { cleanUndefinedToNull } from "./entity-resolver";
const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");

export async function useSSR(fun) {
    return {
        props: {
            data: await new Promise((resolve, reject) => {
                fun((data) => {
                    if (Array.isArray(data)) {
                        const resolution = cleanUndefinedToNull(MERCHI.toJsonList(data))
                        resolve(resolution)
                    } else {
                        const resolution = cleanUndefinedToNull(MERCHI.toJson(data))
                        resolve(resolution)
                    }
                }, reject)
            })
        }
    }
}

export async function fetchSSR(entity, embed) {
    return useSSR((onSuccess, onFailed) => {
        entity.get(onSuccess, onFailed, embed)
    })
}