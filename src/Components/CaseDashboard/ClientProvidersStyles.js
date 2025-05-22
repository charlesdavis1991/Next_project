import React from "react";

const ClientProvidersStyles = ({ clientProviders }) => {
  console.log(clientProviders);
  return (
    <>
      {clientProviders?.map((clientProvider) => (
        <style key={clientProvider?.specialty?.id}>
          {`
          :root {
            --speciality${clientProvider?.specialty?.id}: ${clientProvider?.specialty?.color};
            --speciality${clientProvider?.specialty?.id}-1: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 99%);
            --speciality${clientProvider?.specialty?.id}-2: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 98%);
            --speciality${clientProvider?.specialty?.id}-3: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 97%);
            --speciality${clientProvider?.specialty?.id}-4: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 96%);
            --speciality${clientProvider?.specialty?.id}-5: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 95%);
            --speciality${clientProvider?.specialty?.id}-8: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 92%);
            --speciality${clientProvider?.specialty?.id}-10: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 90%);
            --speciality${clientProvider?.specialty?.id}-12: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 88%);
            --speciality${clientProvider?.specialty?.id}-15: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 85%);
            --speciality${clientProvider?.specialty?.id}-20: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 80%);
            --speciality${clientProvider?.specialty?.id}-25: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 75%);
            --speciality${clientProvider?.specialty?.id}-30: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 70%);
            --speciality${clientProvider?.specialty?.id}-35: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 65%);
            --speciality${clientProvider?.specialty?.id}-40: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 60%);
            --speciality${clientProvider?.specialty?.id}-45: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 55%);
            --speciality${clientProvider?.specialty?.id}-50: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 50%);
            --speciality${clientProvider?.specialty?.id}-55: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 45%);
            --speciality${clientProvider?.specialty?.id}-60: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 40%);
            --speciality${clientProvider?.specialty?.id}-65: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 35%);
            --speciality${clientProvider?.specialty?.id}-70: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 30%);
            --speciality${clientProvider?.specialty?.id}-75: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 25%);
            --speciality${clientProvider?.specialty?.id}-80: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 20%);
            --speciality${clientProvider?.specialty?.id}-85: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 15%);
            --speciality${clientProvider?.specialty?.id}-90: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 10%);
            --speciality${clientProvider?.specialty?.id}-95: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 5%);
            --speciality${clientProvider?.specialty?.id}-96: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 4%);
            --speciality${clientProvider?.specialty?.id}-97: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 3%);
            --speciality${clientProvider?.specialty?.id}-98: color-mix(in srgb, var(--speciality${clientProvider?.specialty?.id}), #fff 2%);
            --speciality${clientProvider?.specialty?.id}-100: color-mix(in srgb, var(--speciality));
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality {
            background: var(--speciality${clientProvider?.specialty?.id}) !important;
          }

          .speciality-row .bg-speciality-10 {
            background: var(--speciality${clientProvider?.specialty?.id}-10);
          }

          .speciality-row .speciality-color-notes {
            background: var(--speciality${clientProvider?.specialty?.id}) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-2 {
            background: var(--speciality${clientProvider?.specialty?.id}-2) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-1 {
            background: var(--speciality${clientProvider?.specialty?.id}-2) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-3 {
            background: var(--speciality${clientProvider?.specialty?.id}-2) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-4 {
            background: var(--speciality${clientProvider?.specialty?.id}-4) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-5 {
            background: var(--speciality${clientProvider?.specialty?.id}-5) !important;
          }
          
          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-8 {
            background: var(--speciality${clientProvider?.specialty?.id}-8) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-10 {
            background: var(--speciality${clientProvider?.specialty?.id}-10) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-12 {
            background: var(--speciality${clientProvider?.specialty?.id}-12) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-15 {
            background: var(--speciality${clientProvider?.specialty?.id}-15) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-20 {
            background: var(--speciality${clientProvider?.specialty?.id}-20) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-25 {
            background: var(--speciality${clientProvider?.specialty?.id}-25) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-30 {
            background: var(--speciality${clientProvider?.specialty?.id}-30) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-35 {
            background: var(--speciality${clientProvider?.specialty?.id}-35) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-40 {
            background: var(--speciality${clientProvider?.specialty?.id}-40) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-45 {
            background: var(--speciality${clientProvider?.specialty?.id}-45) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-50 {
            background: var(--speciality${clientProvider?.specialty?.id}-50) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-55 {
            background: var(--speciality${clientProvider?.specialty?.id}-55) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-60 {
            background: var(--speciality${clientProvider?.specialty?.id}-60) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-65 {
            background: var(--speciality${clientProvider?.specialty?.id}-65) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-70 {
            background: var(--speciality${clientProvider?.specialty?.id}-70) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-75 {
            background: var(--speciality${clientProvider?.specialty?.id}-75) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-80 {
            background: var(--speciality${clientProvider?.specialty?.id}-80) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-85 {
            background: var(--speciality${clientProvider?.specialty?.id}-85) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-90 {
            background: var(--speciality${clientProvider?.specialty?.id}-90) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-95 {
            background: var(--speciality${clientProvider?.specialty?.id}-95) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-96 {
            background: var(--speciality${clientProvider?.specialty?.id}-96) !important;
          }

          .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-97 {
            background: var(--speciality${clientProvider?.specialty?.id}-97) !important;
          }
            .has-speciality-color-${clientProvider?.specialty?.id} .bg-speciality-98 {
            background: var(--speciality${clientProvider?.specialty?.id}-98) !important;
          }
          
          .custom-table-directory tbody tr.specialty-row-${clientProvider?.specialty?.id}:nth-of-type(odd){
            background-color: var(--speciality${clientProvider?.specialty?.id}-4) !important;
          }
          .custom-table-directory tbody tr.specialty-row-${clientProvider?.specialty?.id}:nth-of-type(even) {
            background-color: var(--speciality${clientProvider?.specialty?.id}-2) !important;
          }
          .provider-specialty-${clientProvider?.specialty?.id}-10 {
            background: var(--speciality${clientProvider?.specialty?.id}-10) !important;
          }
          `}
        </style>
      ))}
    </>
  );
};

export default ClientProvidersStyles;
