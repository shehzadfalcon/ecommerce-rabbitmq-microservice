import Router from 'next/router';
import { Dispatch } from 'redux';
import { ProductInterface, Review } from '../../interfaces';
import { proshopAPI } from '../../lib';
import { ActionTypes } from './products.action-types';
import { ProductsAction } from './products.actions';

export const fetchProducts =
  (keyword: string = '', pageId: number = 1) =>
  async (dispatch: Dispatch<ProductsAction>) => {
    try {
      dispatch({
        type: ActionTypes.FETCH_PRODUCTS_START,
      });
      const token=localStorage.getItem('accessToken')

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${token} `
        },
      };
      const { data } = await proshopAPI.get(
        `/products/all?keyword=${keyword}&pageId=${pageId}`,config
      );

      dispatch({
        type: ActionTypes.FETCH_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.FETCH_PRODUCTS_ERROR,
        payload: error.response.data.message,
      });
    }
  };

export const fetchTopRatedProducts =
  () => async (dispatch: Dispatch<ProductsAction>) => {
    try {
      dispatch({
        type: ActionTypes.FETCH_TOP_PRODUCTS_START,
      });
      const token=localStorage.getItem('accessToken')

      const config = {
        headers: {
          'Content-Type': 'application/json',
           Authorization:`Bearer ${token} `
        },
      };
      const { data } = await proshopAPI.get('/products/topRated',config);

      dispatch({
        type: ActionTypes.FETCH_TOP_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.FETCH_TOP_PRODUCTS_ERROR,
        payload: error.response.data.message,
      });
    }
  };

export const fetchProduct =
  (id: string) => async (dispatch: Dispatch<ProductsAction>) => {
    try {
      dispatch({
        type: ActionTypes.FETCH_PRODUCT_START,
      });
      const token=localStorage.getItem('accessToken')

      const config = {
        headers: {
          'Content-Type': 'application/json',
           Authorization:`Bearer ${token} `
        },
      };
      const { data } = await proshopAPI.get(`/products/${id}`,config);

      dispatch({
        type: ActionTypes.FETCH_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.FETCH_PRODUCT_ERROR,
        payload: error.response.data.message,
      });
    }
  };

export const fetchProductReset =
  () => async (dispatch: Dispatch<ProductsAction>) => {
    dispatch({
      type: ActionTypes.FETCH_PRODUCT_RESET,
    });
  };

export const deleteProduct =
  (id: string) => async (dispatch: Dispatch<ProductsAction>) => {
    const token=localStorage.getItem('accessToken')

    const config = {
      headers: {
        'Content-Type': 'application/json',
         Authorization:`Bearer ${token} `
      },
    };
    try {
      dispatch({
        type: ActionTypes.DELETE_PRODUCT_START,
      });

      await proshopAPI.delete(`/products/${id}`, config);

      dispatch({
        type: ActionTypes.DELETE_PRODUCT_SUCCESS,
        payload: null,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.DELETE_PRODUCT_ERROR,
        payload: error.response.data.message,
      });
    }
  };

export const createProduct =
  (body:any) => async (dispatch: Dispatch<ProductsAction>) => {
    const token=localStorage.getItem('accessToken')

    const config = {
      headers: {
        'Content-Type': 'application/json',
         Authorization:`Bearer ${token} `
      },
    };
    try {
      dispatch({
        type: ActionTypes.CREATE_PRODUCT_START,
      });

      const { data } = await proshopAPI.post(`/products`, body, config);

      dispatch({
        type: ActionTypes.CREATE_PRODUCT_SUCCESS,
        payload: data,
      });

      Router.push(`/admin/products`);
    } catch (error: any) {
      dispatch({
        type: ActionTypes.CREATE_PRODUCT_ERROR,
        payload: error.response.data.message,
      });
    }
  };

export const updateProduct =
  (id: string, product: Partial<ProductInterface>) =>
  async (dispatch: Dispatch<ProductsAction>) => {
    const token=localStorage.getItem('accessToken')

    const config = {
      headers: {
        'Content-Type': 'application/json',
         Authorization:`Bearer ${token} `
      },
    };

    try {
      dispatch({
        type: ActionTypes.UPDATE_PRODUCT_START,
      });

      const { data } = await proshopAPI.put(`/products/${id}`, product, config);

      dispatch({
        type: ActionTypes.UPDATE_PRODUCT_SUCCESS,
        payload: data,
      });

      dispatch({
        type: ActionTypes.UPDATE_PRODUCT_RESET,
      });

      Router.push('/admin/products');
    } catch (error: any) {
      dispatch({
        type: ActionTypes.UPDATE_PRODUCT_ERROR,
        payload: error.response.data.message,
      });
    }
  };

export const createProductReview =
  (id: string, review: Review) =>
  async (dispatch: Dispatch<ProductsAction>) => {
    const config = {
      withCredentials: true,
    };

    try {
      dispatch({
        type: ActionTypes.CREATE_PRODUCT_REVIEW_START,
      });

      const { data } = await proshopAPI.put(
        `/products/${id}/review`,
        review,
        config
      );

      dispatch({
        type: ActionTypes.CREATE_PRODUCT_REVIEW_SUCCESS,
        payload: data,
      });

      dispatch({
        type: ActionTypes.CREATE_PRODUCT_REVIEW_RESET,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.CREATE_PRODUCT_REVIEW_ERROR,
        payload: error.response.data.message,
      });
    }
  };
