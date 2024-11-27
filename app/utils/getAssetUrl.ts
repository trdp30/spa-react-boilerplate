const ASSET_BASE_URL = '/assets/images';

export const getAssetUrl = (path: string): string => `${ASSET_BASE_URL}/${path}`;
