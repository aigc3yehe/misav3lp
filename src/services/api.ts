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
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNlcnZpY2UiLCJpYXQiOjE3MzcyNjc3MTN9.4eH6D1kTce5iBTStnihaKFZEC6g6P9Sq2Pp62l7NGPo',
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