import * as hz from 'horizon/core';
export declare const Events: {
    set_skills: hz.LocalEvent<{
        skills: string[];
    }>;
    set_name: hz.LocalEvent<{
        name: string;
    }>;
    set_hp: hz.LocalEvent<{
        hp: number;
    }>;
    set_color: hz.LocalEvent<{
        color: hz.Color;
    }>;
};
