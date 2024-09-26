type dimensionCard = {
  id: string;
  name: string;
  image: string;
  details: string[];
};

const dimensions: dimensionCard[] = [
  {
    id: "01",
    name: "Infraestructura del Hogar",
    image: "https://s3-alpha-sig.figma.com/img/8b81/7a21/aa0c7b3ce58e967108b9788634b8518e?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YuybBbK8ZeRZ5196yL~FWYWV3cgH03Y1DxfnGbewPN9tqrfMQyd85tGkvZaTypUmJqBP3zvqX8iaI8q5IiYzjboym5BeG8jJaAoKQHJ81ZVgoLmcXyHvVdQ~JbwhKT4W8zuweykD8O6SsXODXkPPZUG9-OgkpwH1hUTPOVKo4Z5PoOa0tZr8K1oYFvCdajcJ1WQgYj5cVqjShpkFgRaxIT2dtXBE747yz8p7JfGP99b4I1nVJeS9vYVbG0RciWAcA8Z6noE1MJPEwwEO3YGp7Iwd2QUzKdEX9pnivv~m4LG2hM6KYxqyP6SMQVoViGQH3o5~aoypO1T91sOQGv8U0w__",
    details: ["Vivienda", "Servicios básicos", "Equipamiento"],
  },
  {
    id: "02",
    name: "Educacion",
    image: "https://s3-alpha-sig.figma.com/img/19b6/6604/864b70e2175eb90f395726b64c1ad1fe?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=L75fegg6lNjgzbuxR0ZaEmP6I7G5PsW9jrZepmKhrXgCktLYVzJCknwiuKXPkfHD5wvVRxAys1M9GLMWK~F5bU0Em~sqxnXrtyfiVcRLXJF95WTNwZfw03exfIyqQkgSrJK2TRWxQUOMj6G6UEqasB~3PGlv~pJcpCaQgejis3cbsVIf4Z8rwuI5eRpzYesK0dlwPq5s6z8RtS8u4hDN6942k18T7ym7NwH7iGB2sj0BS05hW3axdGp2Zf~wpgGM4Z5wz~fRpFSs4b7OMgZJ09t6uWy1m9duroTD1UPNudRZA~TUIEY92GdD1qgF5F6ktwtWueDonuiblWyKN-T-XA__",
    details: ["Educación básica", "Educación media", "Educación superior"],
  },
  {
    id: "03",
    name: "Salud",
    image: "https://s3-alpha-sig.figma.com/img/be66/8299/8d89d0b22ba656e52a93059ec981e928?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=PircGHwHx8X8Wd~gNsMG9j8njfYDVucSbyUoqYBc2PxXKB~mUL50w32yeztaJk7r7te-P~Q9SSJrf92hF2Kv1B6WamNu6hsvH7QKoUcEYl-dUYL5TL4lSfV--vTwOFLR3-ycorE8XtykWKF304Hc6LwJIiSF23e9qLvEV-dCUo8TfkZ1ZsLjSwnziIKcOY9Isb1gFE54En6EamfeeO-1-NezA6w5eSu8bc3IW9eq7H0BrpZLdwa2rXmGvxmXCNH29WqWHKgrVQH-ZWr9ohNvqSn7uwkAzptZSXK9ESouhuewV1jqvnVG05f~fNX4ElgTmeLDK3HIQloqjUcKX3lULQ__",
    details: ["Salud preventiva", "Salud curativa", "Salud pública"],
  },
  {
    id: "04",
    name: "Protección Social",
    image: "https://s3-alpha-sig.figma.com/img/d2ea/d141/33a3423f96cebd909977beaf588ca726?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pSCh6ieVHqnXOmQgRI0XKaqyyDIaId8mIESxqoVLQ2vHTnCXlop8GbdxZTZ4CCSJRxbFLbQ1NXoYCtjlKN8Fd8XUyU7z6CBQvS24d7Mgi67jqGq3mcBbyLTOn6lqT8XrxCPJQXH~YM246~prUbUf99orqPAg4Di4zgeNtDy-3i3CPIRyyTRS5JL3Ht3pM8YHVzFVhJ9qbKYPpSRSHZPiQ4deniqooXY6cmK3cmKrsvO9L2TJkbIjFavrAn5Cza2SM4SravCNpuIOXJJGstAHtmN5hn7F1qH~SEWebhB5u5LMwrw3IO9RCAgQsdlAty0HpkmkWXJXDHWt17wUeMOHDw__",
    details: ["Seguro de desempleo", "Seguro de salud", "Seguro de vivienda"],
  },
  {
    id: "05",
    name: "Agricultura",
    image: "https://s3-alpha-sig.figma.com/img/6a60/85d6/b5dea81fc48ece3e1e3c325d27e90b68?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EAXQa75KcQvOQTc2KXzCRd7r0FilC2bMOa8ilirDiGvYzpvXr9g5krByS-635eP63AUWk~9w-cBl0cO0MMtcM3Ki51trO4KwaI1LpHQ64Jrd7l93betTrC8kHHIdzADjY7ao-VWihbAAhRa7vtZId93GZJsJV6hI9202jCSUgI75agna4khxrT6PPCQhM09EWVLV89bLM2J-i8a6En1CmSEYNa2CIY~ByjmA~Bw6vgjASP3GlFq62grvTM74RDsPGUqBn8tNulU1LDm5SBpyvkZsE1Zf2yqnrVM9ePi6EzsQBOltEg6D2ySyo2jB-GCnzg4wtdVsD0UagYkq9dTduQ__",
    details: ["Producción agrícola", "Producción pecuaria", "Pesca"],
  },
  {
    id: "06",
    name: "Activación Económica",
    image: "https://s3-alpha-sig.figma.com/img/57b2/a778/43667cf59c5452f5a538a2882be01b98?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ni2InFcNJHPQmXUuEfWkHb~l2RtEG31hDdfOADRrehaFphN~T8xc3ozS3RibyrV4ppegFTia9B57aMrxEdJ1TCr40NtsT64gFfJUAAmYVc85by9gLV7J7IdDCk6Dxt-KgtjQtM4sHy9UTkhnpbYGp0jizmD5HZneewn556TBEI-ec3Kmsu2R1c0Vpi~aB8KOYt3T3YzNDc0AQYYee0RBEBwBDF4RTB8aWoGkV~hp8vup6Hi-VZiX5e-NA~4IxRQ-~YArPL0WcynhYIjS6h6XdLDekDIPHTEQ7oDbrZiulOeW5sniqNc~vJxNYVmN1XgRyNDO10~~hhe31aboA-Nq~w__",
    details: ["Empleo", "Emprendimiento", "Innovación"],
  },
  {
    id: "07",
    name: "Governanza institucional",
    image: "https://s3-alpha-sig.figma.com/img/0026/2a7a/9b8ac9f14960e21caf02613372b1ec25?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kicMlOtxINywFY8I6yBKPWhX4l1mkf2W0pAZHVGXfNY~NvkSRyET~bBU-k86w-C1N3iUUkcAcVjOQL2TM6q2YGpwKJa3kICYg3vAeEKqhJ1o0tu1iwV12fVHbMDdSzbcIrJo7oqMlpr16A5olpRnvYU~5lfF9rjw6sw2L3nESLFlL9M52AzSr0ht7~bsAbvh6-UvA0ZU0ePeNkTj72VO4R3i751xiAauZ7CcF7wf-YlrM-VU~v7QhZlpprH4Ue5TScjoUeKTWv9ThsXGtEL6mcxhWwBuoA8DiOKVD1W~rQ7mP0T1xpNOjuvf9URYdJQzZW5XKVH5UGSuSPmAhzZo8Q__",
    details: ["Gobierno", "Sociedad civil", "Sector privado"],
  },
];

export default dimensions;
