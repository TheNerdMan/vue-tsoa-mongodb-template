Developer note: Committed Kiota SDK

We commit the generated Kiota SDK into `frontend/node_modules/@memory-soup-client/api` so the frontend Docker image can copy it during build without regenerating on every image build.

If you need to regenerate the SDK:

1. Make sure the backend has generated `../backend/build/swagger.json`.
2. Run `npm run api-sdk-gen` from the `frontend` directory.
3. Commit the updated SDK directory (use `git add -f frontend/node_modules/@memory-soup-client/api` if necessary).
