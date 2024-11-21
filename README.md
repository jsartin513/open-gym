# Open Gym Teammaker

## Deployment

The teammaker is built using next.js and as such uses standard commands to build and deploy the application.

For local deployment
```yarn dev```

For production deployments
```
yarn build
yarn start
```

### Spreadsheet
The teammaker runs off of a google sheet with the following headers:
- name	
- gender	
- skillLevel	
- frequency

This needs to be be exported publically on the web and set as the value for the environment variable `NEXT_PUBLIC_CSV_URL`