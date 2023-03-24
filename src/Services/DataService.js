import Axios from "axios";
import { API_URLS } from "../API/API";
import { localStorageHelper } from "../Helper/LocalStorage";
import { STORAGE, strings } from "../Helper/Utils";

const { Promotions } = API_URLS;

const getPromotions = async () => {
  if (localStorageHelper.exist(STORAGE.PROMOTIONS))
    return localStorageHelper.load(STORAGE.PROMOTIONS);
  else return fetchPromotions();
};

const fetchPromotions = async () => {
  return Axios.get(Promotions.FetchAll).then(
    function (result) {
      console.log(result);
      const dbPromotions = result.data.sort((a, b) => a.sequence - b.sequence);
      localStorageHelper.store(STORAGE.PROMOTIONS, dbPromotions);
      return dbPromotions;
    },
    function (error) {
      const errorMessage = {
        code: error.code,
        message: strings.Error.Reachability,
      };
      throw errorMessage;
    }
  );
};

export { getPromotions };
