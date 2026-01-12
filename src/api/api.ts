/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UserDTO {
  id: string;
  email: string;
  lastSignInAt: string;
  role: string;
  bannedUntil: string | null;
  active: boolean;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserDTO {
  email: string;
  role: string;
}

export type DeleteUserDTO = object;

export interface RoleDTO {
  id: string;
  name: string;
  permissions: (
    | "dashboard"
    | "orders"
    | "bom"
    | "production"
    | "supply"
    | "supply-type"
    | "waste"
    | "products"
    | "enums"
    | "currency"
    | "users"
  )[];
}

export interface AuthorizationMetaDTO {
  permissions: (
    | "dashboard"
    | "orders"
    | "bom"
    | "production"
    | "supply"
    | "supply-type"
    | "waste"
    | "products"
    | "enums"
    | "currency"
    | "users"
  )[];
  roles: RoleDTO[];
}

export interface CreateCurrencyTypeDTO {
  name: string;
  shortName: string;
  symbol: string;
  decimals: number;
}

export interface CurrencyTypeDTO {
  id: string;
  name: string;
  shortName: string;
  symbol: string;
  decimals: number;
  /** @format date-time */
  updatedAt: string;
}

export interface UpdateCurrencyTypeDTO {
  name: string;
  shortName: string;
  symbol: string;
  decimals: number;
}

export interface CurrencyExchangeDTO {
  id: string;
  currencyTypeId: string;
  factor: number;
  /** @format date-time */
  createdAt: string;
}

export interface CreateCurrencyExchangeDTO {
  currencyTypeId: string;
  factor: number;
}

export interface DeleteCurrencyExchangesDTO {
  ids: string[];
}

export interface ColorDTO {
  id: string;
  name: string;
  color: string;
}

export interface CreateColorDTO {
  name: string;
  color: string;
}

export interface UpdateColorDTO {
  name: string;
  color: string;
}

export interface DeleteColorDTO {
  ids: string[];
}

export interface SizeDTO {
  id: string;
  name: string;
  shortName: string;
}

export interface CreateSizeDTO {
  name: string;
  shortName: string;
}

export interface UpdateSizeDTO {
  name: string;
  shortName: string;
}

export interface DeleteSizeDTO {
  ids: string[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title NoryMarket Api
 * @version 1.0.0
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGetUsers
     * @request GET:/auth/users
     */
    authControllerGetUsers: (params: RequestParams = {}) =>
      this.request<UserDTO[], any>({
        path: `/auth/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerDeleteUser
     * @request DELETE:/auth/users
     */
    authControllerDeleteUser: (
      data: DeleteUserDTO,
      params: RequestParams = {},
    ) =>
      this.request<any[], any>({
        path: `/auth/users`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerCreateUser
     * @request POST:/auth/user
     */
    authControllerCreateUser: (
      data: CreateUserDTO,
      params: RequestParams = {},
    ) =>
      this.request<UserDTO, any>({
        path: `/auth/user`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerUpdateUser
     * @request PATCH:/auth/user/{userId}
     */
    authControllerUpdateUser: (
      userId: string,
      data: UpdateUserDTO,
      params: RequestParams = {},
    ) =>
      this.request<UserDTO, any>({
        path: `/auth/user/${userId}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerSetUserActiveStatus
     * @request PATCH:/auth/user/status/{userId}/{status}
     */
    authControllerSetUserActiveStatus: (
      userId: string,
      status: boolean,
      params: RequestParams = {},
    ) =>
      this.request<UserDTO, any>({
        path: `/auth/user/status/${userId}/${status}`,
        method: "PATCH",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGetAuthorizationMeta
     * @request GET:/auth/authorization/meta
     */
    authControllerGetAuthorizationMeta: (params: RequestParams = {}) =>
      this.request<AuthorizationMetaDTO, any>({
        path: `/auth/authorization/meta`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  configuration = {
    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerCreateCurrencyType
     * @request POST:/configuration/currencyType
     */
    configurationControllerCreateCurrencyType: (
      data: CreateCurrencyTypeDTO,
      params: RequestParams = {},
    ) =>
      this.request<CurrencyTypeDTO, any>({
        path: `/configuration/currencyType`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerUpdateCurrencyType
     * @request PATCH:/configuration/currencyType/{currencyTypeId}
     */
    configurationControllerUpdateCurrencyType: (
      currencyTypeId: string,
      data: UpdateCurrencyTypeDTO,
      params: RequestParams = {},
    ) =>
      this.request<CurrencyTypeDTO, any>({
        path: `/configuration/currencyType/${currencyTypeId}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerDeleteCurrencyType
     * @request DELETE:/configuration/currencyType/{currencyTypeId}
     */
    configurationControllerDeleteCurrencyType: (
      currencyTypeId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/configuration/currencyType/${currencyTypeId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerGetCurrencyType
     * @request GET:/configuration/currencyTypes
     */
    configurationControllerGetCurrencyType: (params: RequestParams = {}) =>
      this.request<CurrencyTypeDTO[], any>({
        path: `/configuration/currencyTypes`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerGetCurrencyExchanges
     * @request GET:/configuration/currencyTypes/exchanges
     */
    configurationControllerGetCurrencyExchanges: (params: RequestParams = {}) =>
      this.request<CurrencyExchangeDTO[], any>({
        path: `/configuration/currencyTypes/exchanges`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerCreateCurrencyExchange
     * @request POST:/configuration/currencyTypes/exchanges
     */
    configurationControllerCreateCurrencyExchange: (
      data: CreateCurrencyExchangeDTO,
      params: RequestParams = {},
    ) =>
      this.request<CurrencyExchangeDTO, any>({
        path: `/configuration/currencyTypes/exchanges`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerDeleteCurrencyExchanges
     * @request DELETE:/configuration/currencyTypes/exchanges
     */
    configurationControllerDeleteCurrencyExchanges: (
      data: DeleteCurrencyExchangesDTO,
      params: RequestParams = {},
    ) =>
      this.request<any[], any>({
        path: `/configuration/currencyTypes/exchanges`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerGetCurrencyTypeExchangeHistory
     * @request GET:/configuration/currencyTypes/exchanges/{currencyTypeId}
     */
    configurationControllerGetCurrencyTypeExchangeHistory: (
      currencyTypeId: string,
      params: RequestParams = {},
    ) =>
      this.request<CurrencyExchangeDTO[], any>({
        path: `/configuration/currencyTypes/exchanges/${currencyTypeId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerGetColors
     * @request GET:/configuration/colors
     */
    configurationControllerGetColors: (params: RequestParams = {}) =>
      this.request<ColorDTO[], any>({
        path: `/configuration/colors`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerDeleteColors
     * @request DELETE:/configuration/colors
     */
    configurationControllerDeleteColors: (
      data: DeleteColorDTO,
      params: RequestParams = {},
    ) =>
      this.request<any[], any>({
        path: `/configuration/colors`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerCreateColor
     * @request POST:/configuration/color
     */
    configurationControllerCreateColor: (
      data: CreateColorDTO,
      params: RequestParams = {},
    ) =>
      this.request<ColorDTO, any>({
        path: `/configuration/color`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerUpdateColor
     * @request PATCH:/configuration/color/{colorId}
     */
    configurationControllerUpdateColor: (
      colorId: string,
      data: UpdateColorDTO,
      params: RequestParams = {},
    ) =>
      this.request<ColorDTO, any>({
        path: `/configuration/color/${colorId}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerGetSizes
     * @request GET:/configuration/sizes
     */
    configurationControllerGetSizes: (params: RequestParams = {}) =>
      this.request<SizeDTO[], any>({
        path: `/configuration/sizes`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerDeleteSizes
     * @request DELETE:/configuration/sizes
     */
    configurationControllerDeleteSizes: (
      data: DeleteSizeDTO,
      params: RequestParams = {},
    ) =>
      this.request<any[], any>({
        path: `/configuration/sizes`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerCreateSize
     * @request POST:/configuration/size
     */
    configurationControllerCreateSize: (
      data: CreateSizeDTO,
      params: RequestParams = {},
    ) =>
      this.request<SizeDTO, any>({
        path: `/configuration/size`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name ConfigurationControllerUpdateSize
     * @request PATCH:/configuration/size/{sizeId}
     */
    configurationControllerUpdateSize: (
      sizeId: string,
      data: UpdateSizeDTO,
      params: RequestParams = {},
    ) =>
      this.request<SizeDTO, any>({
        path: `/configuration/size/${sizeId}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
