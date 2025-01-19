export interface GetSkyboxResponse {
  message: string;
  data: {
    url?: string;
    created_at?: string;
  };
}

export const getSkyboxStatus = async (): Promise<GetSkyboxResponse> => {
  const response = await fetch('/studio-api/studio/skybox', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: GetSkyboxResponse = await response.json();
  console.log(data);
  return data;
}; 