import { forwardRef } from "react";

const ChartPie = forwardRef((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      // viewBox="0 0 24 24"
      viewBox="0 0 576 512"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M304 240V16.6c0-9 7-16.6 16-16.6c123.7 0 224 100.3 224 224c0 9-7.6 16-16.6 16zM32 272c0-121.3 90.1-221.7 207-237.7c9.2-1.3 17 6.1 17 15.4V288l156.5 156.5c6.7 6.7 6.2 17.7-1.5 23.1c-39.2 28-87.2 44.4-139 44.4c-132.5 0-240-107.4-240-240m526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288z"
      />
    </svg>
  );
});

ChartPie.displayName = "ChartPie";

const GiftBox = forwardRef((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      // viewBox="0 0 24 24"
      viewBox="0 0 512 512"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="m190.5 68.8l34.8 59.2H152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8M64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32h-41.6c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152c-48.6 0-88 39.4-88 88m336 0c0 22.1-17.9 40-40 40h-73.3l34.8-59.2c7.6-12.9 21.4-20.8 36.3-20.8h2.2c22.1 0 40 17.9 40 40M32 288v176c0 26.5 21.5 48 48 48h144V288zm256 224h144c26.5 0 48-21.5 48-48V288H288z"
      />
    </svg>
  );
});

GiftBox.displayName = "GiftBox";

const LocationPin = forwardRef((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      // viewBox="0 0 24 24"
      viewBox="0 0 512 512"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M256 0c17.7 0 32 14.3 32 32v34.7c80.4 13.4 143.9 76.9 157.3 157.3H480c17.7 0 32 14.3 32 32s-14.3 32-32 32h-34.7c-13.4 80.4-76.9 143.9-157.3 157.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32v-34.7C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h34.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32M128 256a128 128 0 1 0 256 0a128 128 0 1 0-256 0m128-80a80 80 0 1 1 0 160a80 80 0 1 1 0-160"
      />
    </svg>
  );
});

LocationPin.displayName = "LocationPin";

const DistributeVerticalCenter = forwardRef((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M2 16h3v-2h14v2h3v2h-3v2H5v-2H2zm0-8h5v2h10V8h5V6h-5V4H7v2H2z"
      />
    </svg>
  );
});

DistributeVerticalCenter.displayName = "DistributeVerticalCenter";

const Podcast = forwardRef((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      // viewBox="0 0 24 24"
      viewBox="0 0 1536 1792"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M994 1192q0 86-17 197q-31 215-55 313q-22 90-152 90t-152-90q-24-98-55-313q-17-110-17-197q0-168 224-168t224 168m542-424q0 240-134 434t-350 280q-8 3-15-3t-6-15q7-48 10-66q4-32 6-47q1-9 9-12q159-81 255.5-234t96.5-337q0-180-91-330.5T1070 203t-337-74q-124 7-237 61T302.5 330.5t-128 202T128 773q1 184 99 336.5T484 1341q7 3 9 12q3 21 6 45q1 9 5 32.5t6 35.5q1 9-6.5 15t-15.5 2q-148-58-261-169.5t-173.5-264T1 730q7-143 66-273.5t154.5-227T446.5 72T719 2q164-10 315.5 46.5t261 160.5t175 250.5T1536 768m-542-32q0 93-65.5 158.5T770 960t-158.5-65.5T546 736t65.5-158.5T770 512t158.5 65.5T994 736m288 32q0 122-53.5 228.5T1082 1174q-8 6-16 2t-10-14q-6-52-29-92q-7-10 3-20q58-54 91-127t33-155q0-111-58.5-204T938 422.5T726 386q-133 15-229 113T388 730q-10 92 23.5 176t98.5 144q10 10 3 20q-24 41-29 93q-2 9-10 13t-16-2q-95-74-148.5-183T258 757q3-131 69-244t177-181.5T745 257q144-7 268 60t196.5 187.5T1282 768"
      />
    </svg>
  );
});

Podcast.displayName = "Podcast";

const Book = forwardRef((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      // viewBox="0 0 24 24"
      viewBox="0 0 448 512"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M96 0C43 0 0 43 0 96v320c0 53 43 96 96 96h320c17.7 0 32-14.3 32-32s-14.3-32-32-32v-64c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32zm0 384h256v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32m32-240c0-8.8 7.2-16 16-16h192c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16m16 48h192c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16"
      />
    </svg>
  );
});

Book.displayName = "Podcast";

export {
  Book,
  ChartPie,
  DistributeVerticalCenter,
  GiftBox,
  LocationPin,
  Podcast,
};
